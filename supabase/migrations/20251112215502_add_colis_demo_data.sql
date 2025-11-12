/*
  # Add Demo Data for Colis (Package) Management System

  1. Demo Data Overview
    - Creates 15 realistic package records with various statuses
    - Includes diverse customer information and locations
    - Covers all status types: pending, collected, in_transit, delivered, cancelled
    - Demonstrates different product types and values
    - Includes both COD and prepaid packages

  2. Demo Package Statuses
    - Pending: Newly created, awaiting collection
    - Collected: Picked up by courier
    - In Transit: On the way to destination
    - Out for Delivery: With delivery agent
    - Delivered: Successfully delivered
    - Failed Delivery: Delivery attempt failed
    - Cancelled: Package cancelled
    - Returned: Sent back to sender

  3. Demo Cities (Tunisia)
    - Tunis, Sfax, Sousse, Kairouan, Bizerte
    - Gabès, Ariana, Gafsa, Monastir, Ben Arous

  4. Security
    - All demo packages linked to system user
    - Follows existing RLS policies
*/

-- Insert demo colis data
INSERT INTO colis (
  tracking_number,
  user_id,
  client_name,
  client_phone,
  client_address,
  client_city,
  client_postal_code,
  product_description,
  product_value,
  cod_amount,
  weight,
  status,
  notes,
  created_at,
  updated_at
) VALUES
  -- Package 1: Newly created (Pending)
  (
    'SHOPA-2D91-000001',
    (SELECT id FROM auth.users LIMIT 1),
    'Fawzy Othman',
    '55232325',
    'Prins Boudewijnlaan, Cite Ennajeh',
    'Anvers',
    '8000',
    'iPhone 14 Pro Max 256GB - Deep Purple',
    2499.00,
    2499.00,
    0.45,
    'pending',
    'Customer requested express delivery',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
  ),

  -- Package 2: Collected
  (
    'SHOPA-A3F2-000002',
    (SELECT id FROM auth.users LIMIT 1),
    'Amira Ben Salem',
    '98765432',
    'Avenue Habib Bourguiba, Résidence Les Jasmins, Apt 4B',
    'Tunis',
    '1000',
    'Samsung Galaxy S24 Ultra 512GB + Galaxy Buds Pro',
    3299.00,
    3299.00,
    0.62,
    'collected',
    'Fragile - Handle with care',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '6 hours'
  ),

  -- Package 3: In Transit
  (
    'SHOPA-B7K9-000003',
    (SELECT id FROM auth.users LIMIT 1),
    'Mohamed Trabelsi',
    '22334455',
    'Rue de la République, Immeuble Pacha, 3ème étage',
    'Sfax',
    '3000',
    'MacBook Pro 16" M3 Max - Space Black',
    8999.00,
    0.00,
    2.15,
    'in_transit',
    'Prepaid - Already paid online. Insurance included.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '4 hours'
  ),

  -- Package 4: Out for Delivery
  (
    'SHOPA-C4M1-000004',
    (SELECT id FROM auth.users LIMIT 1),
    'Salma Abdallah',
    '50123456',
    'Route de la Corniche, Villa Samar N°15',
    'Sousse',
    '4000',
    'iPad Air 5th Gen 256GB WiFi + Apple Pencil 2',
    1899.00,
    1899.00,
    1.05,
    'out_for_delivery',
    'Call before delivery. Gate code: 1234',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 hours'
  ),

  -- Package 5: Delivered
  (
    'SHOPA-D8N3-000005',
    (SELECT id FROM auth.users LIMIT 1),
    'Karim Mansouri',
    '27889900',
    'Boulevard du 7 Novembre, Résidence El Amal, App 12',
    'Bizerte',
    '7000',
    'Sony PlayStation 5 + 2 Controllers + FIFA 24',
    1599.00,
    1599.00,
    4.50,
    'delivered',
    'Delivered successfully. Signature obtained.',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '1 day'
  ),

  -- Package 6: Pending (Electronics)
  (
    'SHOPA-E2P5-000006',
    (SELECT id FROM auth.users LIMIT 1),
    'Leila Hamdi',
    '93456789',
    'Avenue Mongi Slim, Cité El Khadra, Bloc C App 8',
    'Kairouan',
    '3100',
    'Dell XPS 15 Laptop - Intel i9, 32GB RAM, 1TB SSD',
    4599.00,
    4599.00,
    2.20,
    'pending',
    'Customer available after 5 PM',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours'
  ),

  -- Package 7: Collected (Fashion)
  (
    'SHOPA-F9Q7-000007',
    (SELECT id FROM auth.users LIMIT 1),
    'Youssef Ben Ali',
    '58112233',
    'Rue Farhat Hached, Centre Ville',
    'Gabès',
    '6000',
    'Nike Air Jordan 1 Retro High - Size 42',
    499.00,
    499.00,
    1.20,
    'collected',
    '',
    NOW() - INTERVAL '8 hours',
    NOW() - INTERVAL '3 hours'
  ),

  -- Package 8: Failed Delivery
  (
    'SHOPA-G1R8-000008',
    (SELECT id FROM auth.users LIMIT 1),
    'Nadia Kraiem',
    '21998877',
    'Cité Ennasr 2, Rue du Lac Victoria, Villa 45',
    'Ariana',
    '2080',
    'Canon EOS R6 Mark II + RF 24-70mm f/2.8 Lens',
    7999.00,
    7999.00,
    2.80,
    'failed_delivery',
    'Customer not available. Will retry tomorrow.',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '5 hours'
  ),

  -- Package 9: In Transit (Home Appliance)
  (
    'SHOPA-H5S2-000009',
    (SELECT id FROM auth.users LIMIT 1),
    'Ahmed Toumi',
    '97445566',
    'Avenue de la Paix, Quartier Administratif',
    'Gafsa',
    '2100',
    'Dyson V15 Detect Absolute Vacuum Cleaner',
    1899.00,
    0.00,
    3.50,
    'in_transit',
    'Prepaid. Heavy package - 2 person delivery required',
    NOW() - INTERVAL '30 hours',
    NOW() - INTERVAL '10 hours'
  ),

  -- Package 10: Delivered (Gaming)
  (
    'SHOPA-I3T6-000010',
    (SELECT id FROM auth.users LIMIT 1),
    'Ines Khaled',
    '54778899',
    'Route Touristique, Marina Cap Monastir, App 201',
    'Monastir',
    '5000',
    'Nintendo Switch OLED + Zelda Tears of Kingdom',
    1199.00,
    1199.00,
    1.10,
    'delivered',
    'Delivered to reception desk',
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '2 days'
  ),

  -- Package 11: Cancelled
  (
    'SHOPA-J7U4-000011',
    (SELECT id FROM auth.users LIMIT 1),
    'Rami Zghal',
    '26334455',
    'Cité Olympique, Immeuble B, Escalier 3, App 15',
    'Ben Arous',
    '2013',
    'Samsung 55" QLED 4K Smart TV',
    2299.00,
    2299.00,
    18.50,
    'cancelled',
    'Customer requested cancellation - changed mind',
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '6 hours'
  ),

  -- Package 12: Pending (Books)
  (
    'SHOPA-K2V8-000012',
    (SELECT id FROM auth.users LIMIT 1),
    'Meriem Bouazizi',
    '99887766',
    'Avenue de la Liberté, Résidence Amilcar, 5ème étage',
    'Tunis',
    '1002',
    'Collection Livres Universitaires - Médecine (15 livres)',
    450.00,
    450.00,
    8.20,
    'pending',
    'Student discount applied. Books well packaged.',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour'
  ),

  -- Package 13: Out for Delivery (Jewelry)
  (
    'SHOPA-L6W1-000013',
    (SELECT id FROM auth.users LIMIT 1),
    'Farah Mansour',
    '52119988',
    'Route de la Marsa, Villa Les Palmiers N°88',
    'Tunis',
    '2070',
    'Solitaire Diamond Ring 18K White Gold 0.5ct',
    3499.00,
    3499.00,
    0.10,
    'out_for_delivery',
    'HIGH VALUE - Signature required. Insurance 5000 DT',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 hour'
  ),

  -- Package 14: Returned
  (
    'SHOPA-M9X3-000014',
    (SELECT id FROM auth.users LIMIT 1),
    'Tarek Messaoudi',
    '23556677',
    'Zone Industrielle, Rue des Artisans, Local 24',
    'Sfax',
    '3003',
    'HP OfficeJet Pro 9015e All-in-One Printer',
    799.00,
    799.00,
    12.40,
    'returned',
    'Product defective - returned to sender for refund',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '3 days'
  ),

  -- Package 15: Collected (Cosmetics)
  (
    'SHOPA-N4Y7-000015',
    (SELECT id FROM auth.users LIMIT 1),
    'Sonia Dridi',
    '95224466',
    'Avenue Hédi Chaker, Résidence Nejma, Apt 3A',
    'Sousse',
    '4011',
    'L Oréal Paris Beauty Box - Premium Collection',
    299.00,
    299.00,
    2.30,
    'collected',
    'Gift wrapping requested',
    NOW() - INTERVAL '14 hours',
    NOW() - INTERVAL '8 hours'
  );

-- Insert some demo retours (returns) data
INSERT INTO retours (
  colis_id,
  return_reason,
  return_status,
  verification_notes,
  created_at,
  verified_at
) VALUES
  -- Return for Package 14 (already returned)
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-M9X3-000014'),
    'Product arrived damaged. Screen is cracked and printer not working.',
    'completed',
    'Return approved. Refund processed. Product defect confirmed.',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '5 days'
  ),

  -- Return request for Package 8 (failed delivery - customer wants to cancel)
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-G1R8-000008'),
    'Customer not available for delivery. Requesting return to sender.',
    'requested',
    '',
    NOW() - INTERVAL '4 hours',
    NULL
  ),

  -- Return for Package 11 (cancelled - being processed)
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-J7U4-000011'),
    'Customer cancelled order before delivery. Return to warehouse.',
    'approved',
    'Return approved. Package never left warehouse. Full refund.',
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '3 hours'
  );

-- Create status history table for tracking status changes
CREATE TABLE IF NOT EXISTS colis_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid REFERENCES colis(id) ON DELETE CASCADE NOT NULL,
  old_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text DEFAULT '',
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on status history
ALTER TABLE colis_status_history ENABLE ROW LEVEL SECURITY;

-- RLS policy for status history
CREATE POLICY "Users can view status history for their packages"
  ON colis_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = colis_status_history.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- Insert demo status history
INSERT INTO colis_status_history (colis_id, old_status, new_status, notes, location, created_at) VALUES
  -- History for Package 2 (Collected)
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-A3F2-000002'),
    NULL,
    'pending',
    'Package created',
    'Tunis - Main Office',
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-A3F2-000002'),
    'pending',
    'collected',
    'Picked up by courier TNTrans-TN-001',
    'Tunis - Main Office',
    NOW() - INTERVAL '6 hours'
  ),

  -- History for Package 3 (In Transit)
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-B7K9-000003'),
    NULL,
    'pending',
    'Package created',
    'Tunis - Main Office',
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-B7K9-000003'),
    'pending',
    'collected',
    'Picked up by courier TNTrans-TN-003',
    'Tunis - Main Office',
    NOW() - INTERVAL '1 day 18 hours'
  ),
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-B7K9-000003'),
    'collected',
    'in_transit',
    'Package in transit to Sfax',
    'Tunis - Distribution Center',
    NOW() - INTERVAL '4 hours'
  ),

  -- History for Package 5 (Delivered)
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-D8N3-000005'),
    NULL,
    'pending',
    'Package created',
    'Tunis - Main Office',
    NOW() - INTERVAL '5 days'
  ),
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-D8N3-000005'),
    'pending',
    'collected',
    'Picked up by courier',
    'Tunis - Main Office',
    NOW() - INTERVAL '4 days'
  ),
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-D8N3-000005'),
    'collected',
    'in_transit',
    'Package in transit to Bizerte',
    'Tunis - Distribution Center',
    NOW() - INTERVAL '3 days'
  ),
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-D8N3-000005'),
    'in_transit',
    'out_for_delivery',
    'Out for delivery with courier TNTrans-BZ-012',
    'Bizerte - Local Hub',
    NOW() - INTERVAL '1 day 6 hours'
  ),
  (
    (SELECT id FROM colis WHERE tracking_number = 'SHOPA-D8N3-000005'),
    'out_for_delivery',
    'delivered',
    'Delivered successfully. Signed by: K. Mansouri',
    'Bizerte - Delivery Zone 3',
    NOW() - INTERVAL '1 day'
  );

-- Create indexes for status history
CREATE INDEX IF NOT EXISTS idx_status_history_colis_id ON colis_status_history(colis_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_at ON colis_status_history(created_at DESC);
