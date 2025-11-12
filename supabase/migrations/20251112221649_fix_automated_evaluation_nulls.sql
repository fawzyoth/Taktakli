/*
  # Fix Automated Evaluation System - Handle NULL Values

  1. Changes
    - Fix NULL handling in statistics calculation
    - Ensure default values for all counters
    - Add proper COALESCE for NULL safety

  2. No Breaking Changes
    - Only updates the trigger function
*/

-- Drop and recreate the function with NULL handling
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

  -- Calculate statistics for this client (with NULL safety)
  SELECT 
    COALESCE(COUNT(*), 0),
    COALESCE(SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'failed_delivery' THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END), 0)
  INTO 
    v_total_orders,
    v_delivered,
    v_failed,
    v_cancelled,
    v_returned
  FROM colis
  WHERE client_phone = NEW.client_phone
    AND status IN ('delivered', 'failed_delivery', 'cancelled', 'returned');

  -- Ensure no NULL values
  v_total_orders := COALESCE(v_total_orders, 0);
  v_delivered := COALESCE(v_delivered, 0);
  v_failed := COALESCE(v_failed, 0);
  v_cancelled := COALESCE(v_cancelled, 0);
  v_returned := COALESCE(v_returned, 0);

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
  IF v_total_orders >= 3 
     AND v_success_rate >= 80 
     AND (v_failed::numeric / NULLIF(v_total_orders, 0)::numeric * 100) < 20
     AND v_cancelled <= 1 THEN
    v_new_recommendation := 'good';
    v_evaluation_reason := 'Excellent delivery history: ' || ROUND(v_success_rate, 1) || '% success rate with ' || v_delivered || ' successful deliveries';
  
  -- Not good client criteria (meets ANY):
  ELSIF v_success_rate < 60 
     OR (v_total_orders > 0 AND (v_failed::numeric / v_total_orders::numeric * 100) >= 30)
     OR v_cancelled > 2
     OR (v_total_orders >= 3 AND v_failed > v_delivered) THEN
    v_new_recommendation := 'not_good';
    
    -- Build reason string
    IF v_success_rate < 60 THEN
      v_evaluation_reason := 'Low success rate: ' || ROUND(v_success_rate, 1) || '% (threshold: 60%)';
    ELSIF v_total_orders > 0 AND (v_failed::numeric / v_total_orders::numeric * 100) >= 30 THEN
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

  -- Log evaluation history only if recommendation changed and is not NULL
  IF v_new_recommendation IS NOT NULL 
     AND (v_old_recommendation IS NULL OR v_old_recommendation != v_new_recommendation) THEN
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
