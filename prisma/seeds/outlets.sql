INSERT INTO outlets (id, name, address, city, postal_code, latitude, longitude, created_at, updated_at) VALUES
  (1,  'Outlet Pusat',              'Jl. Sudirman No. 1',                'Jakarta',          '10220', -6.2088, 106.8456, NOW(), NOW()),
  (2,  'Outlet Selatan',            'Jl. Gatot Subroto No. 5',           'Jakarta',          '12930', -6.2382, 106.8349, NOW(), NOW()),
  (3,  'Outlet Kelapa Gading 1',    'Jl. Kelapa Gading Boulevard No. 12','Jakarta Utara',    '14240', -6.1533, 106.8936, NOW(), NOW()),
  (4,  'Outlet Kelapa Gading 2',    'Jl. Kelapa Hybrida Raya No. 45',    'Jakarta Utara',    '14240', -6.1600, 106.9050, NOW(), NOW()),
  (5,  'Outlet Gajah Mada',         'Jl. Gajah Mada No. 88',             'Jakarta Barat',    '11120', -6.1458, 106.8153, NOW(), NOW()),
  (6,  'Outlet Senopati',           'Jl. Senopati Raya No. 22',          'Jakarta Selatan',  '12110', -6.2660, 106.8135, NOW(), NOW()),
  (7,  'Outlet Pantai Indah Kapuk', 'Jl. Pantai Indah Utara 2 No. 5',    'Jakarta Utara',    '14460', -6.1162, 106.7562, NOW(), NOW()),
  (8,  'Outlet Kemang 1',           'Jl. Kemang Selatan 1 No. 10',       'Jakarta Selatan',  '12560', -6.2651, 106.8185, NOW(), NOW()),
  (9,  'Outlet Kemang 2',           'Jl. Kemang Raya No. 25',            'Jakarta Selatan',  '12560', -6.2636, 106.8160, NOW(), NOW()),
  (10, 'Outlet Pondok Indah 1',     'Jl. Metro Pondok Indah No. 6',      'Jakarta Selatan',  '12310', -6.2546, 106.7572, NOW(), NOW()),
  (11, 'Outlet Pondok Indah 2',     'Jl. Pondok Indah Raya No. 12',      'Jakarta Selatan',  '12310', -6.2565, 106.7540, NOW(), NOW()),
  (12, 'Outlet Menteng 1',          'Jl. Riau No. 1',                    'Jakarta Pusat',    '10350', -6.1916, 106.8245, NOW(), NOW()),
  (13, 'Outlet Menteng 2',          'Jl. Anyer XV No. 9A',               'Jakarta Pusat',    '10310', -6.1945, 106.8210, NOW(), NOW()),
  (14, 'Outlet Tanah Abang',        'Jl. Kebon Jati No. 5',              'Jakarta Pusat',    '10240', -6.1972, 106.8038, NOW(), NOW()),
  (15, 'Outlet Sudirman',           'Jl. Jenderal Sudirman No. 1',       'Jakarta Pusat',    '12950', -6.1472, 106.8361, NOW(), NOW()),
  (16, 'Outlet Thamrin',            'Jl. M.H. Thamrin No. 28',           'Jakarta Pusat',    '10310', -6.1925, 106.8125, NOW(), NOW()),
  (17, 'Outlet Pluit 1',            'Jl. Pluit Raya No. 1',              'Jakarta Utara',    '14440', -6.1262, 106.8019, NOW(), NOW()),
  (18, 'Outlet Pluit 2',            'Jl. Pluit Selatan No. 2',           'Jakarta Utara',    '14450', -6.1305, 106.7998, NOW(), NOW()),
  (19, 'Outlet Mangga Dua',         'Jl. Gunung Sahari Raya No. 1',      'Jakarta Utara',    '14420', -6.1382, 106.8317, NOW(), NOW()),
  (20, 'Outlet Puri Indah',         'Jl. Puri Indah Raya No. 8',         'Jakarta Barat',    '11610', -6.1880, 106.7340, NOW(), NOW()),
  (21, 'Outlet Cibubur',            'Jl. Jambore No. 1',                 'Jakarta Timur',    '13720', -6.3693, 106.8941, NOW(), NOW()),
  (22, 'Outlet Tebet',              'Jl. Tebet Raya No. 15',             'Jakarta Selatan',  '12870', -6.2300, 106.8504, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Keep the autoincrement sequence in sync with the explicit ids above
SELECT setval(pg_get_serial_sequence('outlets', 'id'), (SELECT MAX(id) FROM outlets));
