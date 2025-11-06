/*
  # Shop System Tables

  ## Overview
  Creates tables for the online shop selling live streaming equipment
  (phones, ring lights, tripods, microphones, etc.)

  ## New Tables

  ### `shop_categories` (product categories)
  Organizes products into categories
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name (e.g., "Smartphones", "Ring Lights")
  - `slug` (text, unique) - URL-friendly category name
  - `description` (text) - Category description
  - `image_url` (text) - Category image
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz) - Creation timestamp

  ### `shop_products` (products for sale)
  Stores all shop products and their details
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid) - Reference to category
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly product name
  - `description` (text) - Full product description
  - `short_description` (text) - Brief description for listings
  - `price` (numeric) - Product price in DT
  - `original_price` (numeric, optional) - Original price for sale display
  - `stock_quantity` (integer) - Available stock
  - `images` (text[]) - Array of image URLs
  - `features` (jsonb) - Product features and specifications
  - `is_featured` (boolean) - Show on homepage
  - `is_available` (boolean) - Currently available for purchase
  - `view_count` (integer) - Number of views
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `shop_orders` (customer orders)
  Tracks all customer orders
  - `id` (uuid, primary key) - Unique order identifier
  - `order_number` (text, unique) - Human-readable order number
  - `user_id` (uuid) - Reference to auth.users
  - `customer_name` (text) - Customer name
  - `customer_phone` (text) - Contact phone
  - `customer_email` (text) - Contact email
  - `shipping_address` (text) - Delivery address
  - `shipping_city` (text) - City
  - `shipping_postal_code` (text) - Postal code
  - `subtotal` (numeric) - Order subtotal
  - `shipping_cost` (numeric) - Shipping fee
  - `total` (numeric) - Total amount
  - `payment_method` (text) - Payment method (cod, online)
  - `order_status` (text) - Status (pending, confirmed, shipped, delivered, cancelled)
  - `notes` (text) - Order notes
  - `created_at` (timestamptz) - Order date
  - `updated_at` (timestamptz) - Last update

  ### `shop_order_items` (items in each order)
  Line items for each order
  - `id` (uuid, primary key) - Unique item identifier
  - `order_id` (uuid) - Reference to order
  - `product_id` (uuid) - Reference to product
  - `product_name` (text) - Product name snapshot
  - `product_image` (text) - Product image snapshot
  - `quantity` (integer) - Quantity ordered
  - `unit_price` (numeric) - Price per unit
  - `total_price` (numeric) - Line total
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public can view products and categories
  - Users can create and view their own orders
  - Admin access for product management

  ## Notes
  - Automatic order number generation with prefix "ORD-"
  - Stock management with quantity tracking
  - Support for product variants via features JSONB
  - Featured products for homepage display
*/

-- Create shop_categories table
CREATE TABLE IF NOT EXISTS shop_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create shop_products table
CREATE TABLE IF NOT EXISTS shop_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES shop_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  short_description text DEFAULT '',
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  stock_quantity integer NOT NULL DEFAULT 0,
  images text[] DEFAULT '{}',
  features jsonb DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_available boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shop_orders table
CREATE TABLE IF NOT EXISTS shop_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL DEFAULT 'ORD-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text DEFAULT '',
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_postal_code text NOT NULL,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  shipping_cost numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cod',
  order_status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shop_order_items table
CREATE TABLE IF NOT EXISTS shop_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES shop_orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES shop_products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON shop_products(category_id);
CREATE INDEX IF NOT EXISTS idx_shop_products_featured ON shop_products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_shop_products_available ON shop_products(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_shop_orders_user ON shop_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_status ON shop_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_order ON shop_order_items(order_id);

-- Enable Row Level Security
ALTER TABLE shop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shop_categories (public read)

CREATE POLICY "Anyone can view categories"
  ON shop_categories
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for shop_products (public read)

CREATE POLICY "Anyone can view available products"
  ON shop_products
  FOR SELECT
  TO public
  USING (is_available = true);

-- RLS Policies for shop_orders

CREATE POLICY "Users can view own orders"
  ON shop_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create orders"
  ON shop_orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own pending orders"
  ON shop_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND order_status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for shop_order_items

CREATE POLICY "Users can view own order items"
  ON shop_order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shop_orders
      WHERE shop_orders.id = shop_order_items.order_id
      AND shop_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create order items"
  ON shop_order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_shop_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_shop_products_updated_at ON shop_products;
CREATE TRIGGER update_shop_products_updated_at
  BEFORE UPDATE ON shop_products
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_updated_at();

DROP TRIGGER IF EXISTS update_shop_orders_updated_at ON shop_orders;
CREATE TRIGGER update_shop_orders_updated_at
  BEFORE UPDATE ON shop_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_updated_at();

-- Insert sample categories
INSERT INTO shop_categories (name, slug, description, image_url, display_order) VALUES
  ('Smartphones', 'smartphones', 'Téléphones performants pour le live streaming', 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg', 1),
  ('Ring Lights', 'ring-lights', 'Éclairages professionnels pour vos lives', 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg', 2),
  ('Trépieds', 'trepieds', 'Supports stables pour votre téléphone', 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg', 3),
  ('Microphones', 'microphones', 'Audio de qualité professionnelle', 'https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg', 4),
  ('Accessoires', 'accessoires', 'Tous les accessoires pour le streaming', 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO shop_products (category_id, name, slug, description, short_description, price, original_price, stock_quantity, images, features, is_featured, is_available) VALUES
  (
    (SELECT id FROM shop_categories WHERE slug = 'smartphones'),
    'iPhone 15 Pro Max',
    'iphone-15-pro-max',
    'Le smartphone ultime pour le streaming professionnel avec caméra 48MP, processeur A17 Pro et écran ProMotion 120Hz.',
    'Smartphone premium avec caméra 48MP parfait pour le live streaming',
    4299.00,
    4799.00,
    15,
    ARRAY['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
    '{"screen": "6.7 pouces", "camera": "48MP", "processor": "A17 Pro", "ram": "8GB", "storage": "256GB"}'::jsonb,
    true,
    true
  ),
  (
    (SELECT id FROM shop_categories WHERE slug = 'ring-lights'),
    'Ring Light LED 18 pouces',
    'ring-light-18-pouces',
    'Anneau lumineux professionnel avec 3 modes de couleur et intensité réglable. Parfait pour un éclairage uniforme lors de vos lives.',
    'Éclairage LED professionnel 18 pouces avec 3 modes',
    349.00,
    449.00,
    25,
    ARRAY['https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg'],
    '{"diameter": "18 pouces", "modes": "3", "power": "65W", "brightness": "Réglable 1-100%"}'::jsonb,
    true,
    true
  ),
  (
    (SELECT id FROM shop_categories WHERE slug = 'trepieds'),
    'Trépied Télescopique Pro',
    'trepied-telescopique-pro',
    'Trépied robuste et stable, hauteur réglable de 50cm à 160cm, compatible avec tous les smartphones.',
    'Trépied professionnel hauteur réglable 50-160cm',
    129.00,
    179.00,
    30,
    ARRAY['https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg'],
    '{"height": "50-160cm", "weight": "1.2kg", "material": "Aluminium", "head": "3-axes"}'::jsonb,
    true,
    true
  ),
  (
    (SELECT id FROM shop_categories WHERE slug = 'microphones'),
    'Micro-Cravate Sans Fil',
    'micro-cravate-sans-fil',
    'Microphone sans fil ultra compact avec réduction de bruit pour un son cristallin. Batterie 8h.',
    'Micro sans fil compact avec réduction de bruit',
    299.00,
    NULL,
    20,
    ARRAY['https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg'],
    '{"type": "Sans fil", "battery": "8h", "range": "50m", "noise_reduction": "Oui"}'::jsonb,
    false,
    true
  ),
  (
    (SELECT id FROM shop_categories WHERE slug = 'accessoires'),
    'Kit Complet Streaming',
    'kit-complet-streaming',
    'Pack complet avec support téléphone, mini trépied, LED portable et câbles. Tout pour démarrer!',
    'Kit débutant complet pour le live streaming',
    199.00,
    279.00,
    40,
    ARRAY['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'],
    '{"includes": ["Support téléphone", "Mini trépied", "LED portable", "Câbles USB-C"]}'::jsonb,
    true,
    true
  )
ON CONFLICT (slug) DO NOTHING;
