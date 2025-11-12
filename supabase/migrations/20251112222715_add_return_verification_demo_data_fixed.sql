/*
  # Add Demo Data for Return Verification System

  ## Overview
  Populates the system with realistic return verification records
*/

-- Get existing colis IDs and create return verification data
DO $$
DECLARE
  v_colis_ids uuid[];
  v_retour_id uuid;
BEGIN
  SELECT array_agg(id) INTO v_colis_ids FROM colis LIMIT 10;

  -- Return 1: Pending verification
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, return_status, created_at)
  VALUES (v_colis_ids[1], 'return', 'general', 'client_refused', 'approved', now() - interval '5 days')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (retour_id, colis_id, verification_status, approval_status, started_at, created_at)
  VALUES (v_retour_id, v_colis_ids[1], 'pending', 'pending', now() - interval '5 days', now() - interval '5 days');

  -- Return 2: In progress with damage assessment
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, return_status, created_at)
  VALUES (v_colis_ids[2], 'return', 'electronics', 'damaged_product', 'approved', now() - interval '3 days')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (
    retour_id, colis_id, verification_status, package_condition, items_complete, items_damaged,
    damage_description, approval_status, started_at, created_at
  ) VALUES (
    v_retour_id, v_colis_ids[2], 'in_progress', 'damaged', true, true,
    'Écran fissuré dans le coin supérieur gauche. Boîtier intact.', 'pending',
    now() - interval '2 days', now() - interval '3 days'
  );

  -- Return 3: Completed with full refund
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, return_status, created_at, verified_at)
  VALUES (v_colis_ids[3], 'return', 'clothing', 'wrong_product', 'completed', now() - interval '10 days', now() - interval '7 days')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (
    retour_id, colis_id, verification_status, package_condition, items_complete, items_damaged,
    approval_status, approval_notes, refund_amount, started_at, completed_at, created_at
  ) VALUES (
    v_retour_id, v_colis_ids[3], 'completed', 'excellent', true, false,
    'approved', 'Produit retourné en excellent état. Remboursement complet approuvé.', 159.99,
    now() - interval '8 days', now() - interval '7 days', now() - interval '10 days'
  );

  -- Return 4: Completed approved
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, return_status, created_at, verified_at)
  VALUES (v_colis_ids[4], 'return', 'general', 'client_absent', 'completed', now() - interval '8 days', now() - interval '6 days')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (
    retour_id, colis_id, verification_status, package_condition, items_complete, items_damaged,
    approval_status, approval_notes, refund_amount, started_at, completed_at, created_at
  ) VALUES (
    v_retour_id, v_colis_ids[4], 'completed', 'good', true, false,
    'approved', 'Emballage ouvert mais produit en bon état.', 89.50,
    now() - interval '7 days', now() - interval '6 days', now() - interval '8 days'
  );

  -- Return 5: Rejected
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, custom_reason, return_status, created_at, verified_at)
  VALUES (v_colis_ids[5], 'return', 'general', 'other', 'Emballage compromis', 'completed', now() - interval '12 days', now() - interval '9 days')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (
    retour_id, colis_id, verification_status, package_condition, items_complete, items_damaged,
    damage_description, approval_status, approval_notes, refund_amount, started_at, completed_at, created_at
  ) VALUES (
    v_retour_id, v_colis_ids[5], 'completed', 'poor', false, true,
    'Emballage fortement endommagé. Produit manquant.', 'rejected',
    'Retour rejeté : emballage compromis et article manquant.', 0,
    now() - interval '10 days', now() - interval '9 days', now() - interval '12 days'
  );

  -- Return 6: Book exchange
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, exchange_reason, return_status, created_at)
  VALUES (v_colis_ids[6], 'exchange', 'book', 'wrong_book', 'Le Guide du Développeur JavaScript', 'exchange_processing', now() - interval '2 days');

  -- Return 7: Partial refund
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, return_status, created_at, verified_at)
  VALUES (v_colis_ids[7], 'return', 'electronics', 'damaged_product', 'completed', now() - interval '6 days', now() - interval '4 days')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (
    retour_id, colis_id, verification_status, package_condition, items_complete, items_damaged,
    damage_description, approval_status, approval_notes, refund_amount, started_at, completed_at, created_at
  ) VALUES (
    v_retour_id, v_colis_ids[7], 'completed', 'fair', true, true,
    'Petite rayure sur le boîtier. Fonctionnel mais apparence affectée.', 'partial',
    'Remboursement partiel accordé en raison de dommages cosmétiques mineurs.', 67.50,
    now() - interval '5 days', now() - interval '4 days', now() - interval '6 days'
  );

  -- Return 8: Pending
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, return_status, created_at)
  VALUES (v_colis_ids[8], 'return', 'general', 'wrong_product', 'approved', now() - interval '1 day')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (retour_id, colis_id, verification_status, approval_status, started_at, created_at)
  VALUES (v_retour_id, v_colis_ids[8], 'pending', 'pending', now() - interval '1 day', now() - interval '1 day');

  -- Return 9: In progress
  INSERT INTO retours (colis_id, request_type, product_type, return_reason, return_status, created_at)
  VALUES (v_colis_ids[9], 'return', 'general', 'client_refused', 'approved', now() - interval '4 days')
  RETURNING id INTO v_retour_id;

  INSERT INTO return_verifications (
    retour_id, colis_id, verification_status, package_condition, items_complete, items_damaged,
    approval_status, started_at, created_at
  ) VALUES (
    v_retour_id, v_colis_ids[9], 'in_progress', 'good', true, false,
    'pending', now() - interval '3 days', now() - interval '4 days'
  );

  -- Return 10: Book exchange different edition
  IF array_length(v_colis_ids, 1) >= 10 THEN
    INSERT INTO retours (colis_id, request_type, product_type, return_reason, exchange_reason, return_status, created_at)
    VALUES (v_colis_ids[10], 'exchange', 'book', 'different_edition', 'Édition 2024 du même titre', 'exchange_processing', now() - interval '1 day');
  END IF;

END $$;
