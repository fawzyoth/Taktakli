/*
  # Automated Client Evaluation System

  ## Overview
  This migration implements a fully automated client evaluation system that:
  - Evaluates clients based on their delivery history
  - Runs automatically when package statuses change
  - Requires no manual intervention
  - Maintains complete audit trails

  ## Evaluation Criteria
  A client is evaluated as "good" if they meet ALL criteria:
  1. Delivery success rate >= 80% (delivered packages / total packages)
  2. At least 3 completed deliveries
  3. Failed delivery rate < 20%
  4. No more than 1 cancelled order

  A client is evaluated as "not_good" if they meet ANY criteria:
  1. Delivery success rate < 60%
  2. Failed delivery rate >= 30%
  3. More than 2 cancelled orders
  4. More than 50% of deliveries failed

  ## Tables Created
  1. client_evaluation_history - Audit trail of all evaluations
  2. client_statistics - Aggregated statistics per client

  ## Triggers
  - Automatic evaluation on package status change to terminal states
  - Terminal states: delivered, failed_delivery, cancelled, returned
*/

-- Table to store client statistics (aggregated data)
CREATE TABLE IF NOT EXISTS client_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_phone text NOT NULL UNIQUE,
  client_name text NOT NULL,
  total_orders integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  cancelled_count integer DEFAULT 0,
  returned_count integer DEFAULT 0,
  success_rate numeric DEFAULT 0,
  current_recommendation text,
  last_evaluated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT client_statistics_recommendation_check 
    CHECK (current_recommendation IN ('good', 'not_good') OR current_recommendation IS NULL)
);

-- Table to store evaluation history (audit trail)
CREATE TABLE IF NOT EXISTS client_evaluation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_phone text NOT NULL,
  client_name text NOT NULL,
  previous_recommendation text,
  new_recommendation text NOT NULL,
  total_orders integer NOT NULL,
  delivered_count integer NOT NULL,
  failed_count integer NOT NULL,
  cancelled_count integer NOT NULL,
  success_rate numeric NOT NULL,
  evaluation_reason text NOT NULL,
  evaluated_at timestamptz DEFAULT now(),
  CONSTRAINT client_eval_history_recommendation_check 
    CHECK (new_recommendation IN ('good', 'not_good'))
);

-- Enable RLS on new tables
ALTER TABLE client_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_evaluation_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access for statistics
CREATE POLICY "Allow public read access to client statistics"
  ON client_statistics
  FOR SELECT
  TO anon
  USING (true);

-- Allow public read access for evaluation history
CREATE POLICY "Allow public read access to evaluation history"
  ON client_evaluation_history
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_statistics_phone ON client_statistics(client_phone);
CREATE INDEX IF NOT EXISTS idx_client_eval_history_phone ON client_evaluation_history(client_phone);
CREATE INDEX IF NOT EXISTS idx_client_eval_history_evaluated_at ON client_evaluation_history(evaluated_at);

-- Function to update client statistics
CREATE OR REPLACE FUNCTION update_client_statistics()
RETURNS TRIGGER AS $$
DECLARE
  v_total_orders integer;
  v_delivered integer;
  v_failed integer;
  v_cancelled integer;
  v_returned integer;
  v_success_rate numeric;
  v_old_recommendation text;
  v_new_recommendation text;
  v_evaluation_reason text;
BEGIN
  -- Only process terminal states
  IF NEW.status NOT IN ('delivered', 'failed_delivery', 'cancelled', 'returned') THEN
    RETURN NEW;
  END IF;

  -- Only process if status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Calculate statistics for this client
  SELECT 
    COUNT(*),
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END),
    SUM(CASE WHEN status = 'failed_delivery' THEN 1 ELSE 0 END),
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END),
    SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END)
  INTO 
    v_total_orders,
    v_delivered,
    v_failed,
    v_cancelled,
    v_returned
  FROM colis
  WHERE client_phone = NEW.client_phone
    AND status IN ('delivered', 'failed_delivery', 'cancelled', 'returned');

  -- Calculate success rate
  IF v_total_orders > 0 THEN
    v_success_rate := (v_delivered::numeric / v_total_orders::numeric) * 100;
  ELSE
    v_success_rate := 0;
  END IF;

  -- Get current recommendation
  SELECT current_recommendation INTO v_old_recommendation
  FROM client_statistics
  WHERE client_phone = NEW.client_phone;

  -- Determine new recommendation based on criteria
  -- Good client criteria (must meet ALL):
  -- 1. Success rate >= 80%
  -- 2. At least 3 completed deliveries
  -- 3. Failed rate < 20%
  -- 4. No more than 1 cancelled order
  IF v_total_orders >= 3 
     AND v_success_rate >= 80 
     AND (v_failed::numeric / v_total_orders::numeric * 100) < 20
     AND v_cancelled <= 1 THEN
    v_new_recommendation := 'good';
    v_evaluation_reason := 'Excellent delivery history: ' || ROUND(v_success_rate, 1) || '% success rate with ' || v_delivered || ' successful deliveries';
  
  -- Not good client criteria (meets ANY):
  -- 1. Success rate < 60%
  -- 2. Failed rate >= 30%
  -- 3. More than 2 cancelled orders
  -- 4. Total orders >= 3 AND more than 50% failed
  ELSIF v_success_rate < 60 
     OR (v_failed::numeric / v_total_orders::numeric * 100) >= 30
     OR v_cancelled > 2
     OR (v_total_orders >= 3 AND v_failed > v_delivered) THEN
    v_new_recommendation := 'not_good';
    
    -- Build reason string
    IF v_success_rate < 60 THEN
      v_evaluation_reason := 'Low success rate: ' || ROUND(v_success_rate, 1) || '% (threshold: 60%)';
    ELSIF (v_failed::numeric / v_total_orders::numeric * 100) >= 30 THEN
      v_evaluation_reason := 'High failure rate: ' || ROUND((v_failed::numeric / v_total_orders::numeric * 100), 1) || '% (threshold: 30%)';
    ELSIF v_cancelled > 2 THEN
      v_evaluation_reason := 'Too many cancelled orders: ' || v_cancelled || ' (threshold: 2)';
    ELSE
      v_evaluation_reason := 'More failed deliveries than successful: ' || v_failed || ' failed vs ' || v_delivered || ' delivered';
    END IF;
  ELSE
    -- Not enough data or neutral performance
    v_new_recommendation := NULL;
    v_evaluation_reason := 'Insufficient data or neutral performance';
  END IF;

  -- Update or insert client statistics
  INSERT INTO client_statistics (
    client_phone,
    client_name,
    total_orders,
    delivered_count,
    failed_count,
    cancelled_count,
    returned_count,
    success_rate,
    current_recommendation,
    last_evaluated_at,
    updated_at
  ) VALUES (
    NEW.client_phone,
    NEW.client_name,
    v_total_orders,
    v_delivered,
    v_failed,
    v_cancelled,
    v_returned,
    v_success_rate,
    v_new_recommendation,
    now(),
    now()
  )
  ON CONFLICT (client_phone) 
  DO UPDATE SET
    client_name = EXCLUDED.client_name,
    total_orders = EXCLUDED.total_orders,
    delivered_count = EXCLUDED.delivered_count,
    failed_count = EXCLUDED.failed_count,
    cancelled_count = EXCLUDED.cancelled_count,
    returned_count = EXCLUDED.returned_count,
    success_rate = EXCLUDED.success_rate,
    current_recommendation = EXCLUDED.current_recommendation,
    last_evaluated_at = EXCLUDED.last_evaluated_at,
    updated_at = EXCLUDED.updated_at;

  -- Log evaluation history only if recommendation changed
  IF v_new_recommendation IS NOT NULL AND (v_old_recommendation IS NULL OR v_old_recommendation != v_new_recommendation) THEN
    INSERT INTO client_evaluation_history (
      client_phone,
      client_name,
      previous_recommendation,
      new_recommendation,
      total_orders,
      delivered_count,
      failed_count,
      cancelled_count,
      success_rate,
      evaluation_reason
    ) VALUES (
      NEW.client_phone,
      NEW.client_name,
      v_old_recommendation,
      v_new_recommendation,
      v_total_orders,
      v_delivered,
      v_failed,
      v_cancelled,
      v_success_rate,
      v_evaluation_reason
    );
  END IF;

  -- Update the colis record with new recommendation
  NEW.client_recommendation := v_new_recommendation;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically evaluate clients
DROP TRIGGER IF EXISTS trigger_auto_evaluate_client ON colis;
CREATE TRIGGER trigger_auto_evaluate_client
  BEFORE UPDATE OF status ON colis
  FOR EACH ROW
  EXECUTE FUNCTION update_client_statistics();

-- Function to bulk update existing colis with recommendations
CREATE OR REPLACE FUNCTION sync_existing_client_recommendations()
RETURNS void AS $$
DECLARE
  v_colis RECORD;
BEGIN
  FOR v_colis IN 
    SELECT DISTINCT ON (client_phone) 
      id, client_phone, client_name, status
    FROM colis
    WHERE status IN ('delivered', 'failed_delivery', 'cancelled', 'returned')
    ORDER BY client_phone, created_at DESC
  LOOP
    -- Trigger the evaluation by updating the status to itself
    UPDATE colis 
    SET status = v_colis.status
    WHERE id = v_colis.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute sync for existing data
SELECT sync_existing_client_recommendations();

-- Update all colis records to reflect their client's current recommendation
UPDATE colis c
SET client_recommendation = cs.current_recommendation
FROM client_statistics cs
WHERE c.client_phone = cs.client_phone
  AND (c.client_recommendation IS NULL OR c.client_recommendation != cs.current_recommendation);
