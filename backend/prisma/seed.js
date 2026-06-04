const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ============================================================
// SAFE SEED - Chỉ thêm data nếu chưa tồn tại
// Không bao giờ xóa data cũ → an toàn khi chạy nhiều lần
// Ảnh default nằm trong /uploads/products/ (push lên git)
// ============================================================

async function seedAdmin() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@healthstore.com' },
  });
  if (existing) {
    console.log('⏭️  Admin đã tồn tại, bỏ qua');
    return;
  }
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@healthstore.com',
      password: hashed,
      name: 'Admin',
      phone: '0834464618',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin account created');
}

async function seedCategories() {
  const defaultCategories = [
    { name: 'Thực phẩm chức năng', slug: 'thuc-pham-chuc-nang', description: 'Các loại thực phẩm bổ sung dinh dưỡng' },
    { name: 'Vitamin tổng hợp',    slug: 'vitamin-tong-hop',    description: 'Vitamin tổng hợp cho mọi lứa tuổi' },
    { name: 'Canxi & Xương khớp',  slug: 'canxi-xuong-khop',   description: 'Hỗ trợ xương khớp chắc khỏe' },
    { name: 'Bổ gan',              slug: 'bo-gan',              description: 'Hỗ trợ chức năng gan' },
    { name: 'Bổ mắt',              slug: 'bo-mat',              description: 'Bảo vệ thị lực' },
    { name: 'Sữa dinh dưỡng',      slug: 'sua-dinh-duong',     description: 'Sữa Ensure và sữa trẻ em' },
    { name: 'Nước hoa',            slug: 'nuoc-hoa',            description: 'Nước hoa cao cấp từ Mỹ' },
    { name: 'Chăm sóc răng miệng', slug: 'cham-soc-rang-mieng', description: 'Kem đánh răng và chăm sóc răng miệng' },
    { name: 'Chăm sóc cá nhân',    slug: 'cham-soc-ca-nhan',   description: 'Lăn nách và các sản phẩm chăm sóc' },
  ];

  let created = 0;
  for (const cat of defaultCategories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      created++;
    }
  }

  if (created > 0) console.log(`✅ Tạo ${created} danh mục mới`);
  else console.log('⏭️  Tất cả danh mục đã tồn tại, bỏ qua');
}

async function seedProducts() {
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.log('⚠️  Chưa có danh mục, bỏ qua seed sản phẩm');
    return;
  }

  const getCatId = (slug) => categories.find((c) => c.slug === slug)?.id;

  // Mapping: slug → ảnh thực tế trong /uploads/products/
  const defaultProducts = [
    {
      slug: 'nature-made-multivitamin',
      image: '/uploads/products/multivitamin.webp',
      data: {
        name: 'Nature Made Multivitamin',
        categoryId: getCatId('thuc-pham-chuc-nang'),
        description: 'Vitamin tổng hợp Nature Made hỗ trợ sức khỏe toàn diện.',
        price: 450000, salePrice: 399000, stock: 100,
        brand: 'Nature Made', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'omega-3-fish-oil-1000mg',
      image: '/uploads/products/omega-3.jpg',
      data: {
        name: 'Omega-3 Fish Oil 1000mg',
        categoryId: getCatId('thuc-pham-chuc-nang'),
        description: 'Dầu cá Omega-3 hỗ trợ tim mạch và não bộ.',
        price: 550000, salePrice: 499000, stock: 80,
        brand: 'Nature Made', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'vitamin-c-1000mg',
      image: '/uploads/products/vitamin-c.webp',
      data: {
        name: 'Vitamin C 1000mg',
        categoryId: getCatId('vitamin-tong-hop'),
        description: 'Vitamin C liều cao tăng cường miễn dịch.',
        price: 350000, salePrice: 299000, stock: 150,
        brand: "Nature's Bounty", origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'vitamin-d3-5000-iu',
      image: '/uploads/products/vitamin-d3.webp',
      data: {
        name: 'Vitamin D3 5000 IU',
        categoryId: getCatId('vitamin-tong-hop'),
        description: 'Vitamin D3 hỗ trợ hấp thu canxi.',
        price: 400000, stock: 120,
        brand: 'NOW Foods', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'calcium-600mg-d3',
      image: '/uploads/products/calcium.webp',
      data: {
        name: 'Calcium 600mg + D3',
        categoryId: getCatId('canxi-xuong-khop'),
        description: 'Canxi kết hợp vitamin D3 hỗ trợ xương chắc khỏe.',
        price: 380000, salePrice: 349000, stock: 90,
        brand: 'Citracal', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'milk-thistle-1000mg',
      image: '/uploads/products/milk-thistle.webp',
      data: {
        name: 'Milk Thistle 1000mg',
        categoryId: getCatId('bo-gan'),
        description: 'Tinh chất kế sữa hỗ trợ giải độc và bảo vệ gan.',
        price: 480000, stock: 70,
        brand: "Nature's Bounty", origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'lutein-20mg-eye-health',
      image: '/uploads/products/lutein.webp',
      data: {
        name: 'Lutein 20mg Eye Health',
        categoryId: getCatId('bo-mat'),
        description: 'Lutein bảo vệ mắt khỏi ánh sáng xanh.',
        price: 520000, salePrice: 469000, stock: 85,
        brand: 'Bausch + Lomb', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'ensure-original-nutrition-powder',
      image: '/uploads/products/ensure.webp',
      data: {
        name: 'Ensure Original Nutrition Powder',
        categoryId: getCatId('sua-dinh-duong'),
        description: 'Sữa Ensure dinh dưỡng đầy đủ cho người lớn tuổi.',
        price: 680000, salePrice: 649000, stock: 50,
        brand: 'Ensure', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'similac-pro-advance-infant-formula',
      image: '/uploads/products/similac.webp',
      data: {
        name: 'Similac Pro-Advance Infant Formula',
        categoryId: getCatId('sua-dinh-duong'),
        description: 'Sữa công thức Similac cho trẻ sơ sinh đến 12 tháng.',
        price: 890000, stock: 40,
        brand: 'Similac', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'calvin-klein-ck-one-edt-200ml',
      image: '/uploads/products/calvin.PNG',
      data: {
        name: 'Calvin Klein CK One EDT 200ml',
        categoryId: getCatId('nuoc-hoa'),
        description: 'Nước hoa unisex tươi mát, phù hợp mọi lứa tuổi.',
        price: 1200000, salePrice: 1099000, stock: 30,
        brand: 'Calvin Klein', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'crest-3d-white-toothpaste',
      image: '/uploads/products/crest.webp',
      data: {
        name: 'Crest 3D White Toothpaste',
        categoryId: getCatId('cham-soc-rang-mieng'),
        description: 'Kem đánh răng trắng răng vượt trội.',
        price: 180000, salePrice: 159000, stock: 200,
        brand: 'Crest', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'degree-men-antiperspirant-deodorant',
      image: '/uploads/products/degree.webp',
      data: {
        name: 'Degree Men Antiperspirant Deodorant',
        categoryId: getCatId('cham-soc-ca-nhan'),
        description: 'Lăn khử mùi nam giới bảo vệ 48 giờ.',
        price: 220000, salePrice: 199000, stock: 150,
        brand: 'Degree', origin: 'USA', status: 'ACTIVE',
      },
    },
    {
      slug: 'dove-advanced-care-deodorant',
      image: '/uploads/products/dove.webp',
      data: {
        name: 'Dove Advanced Care Deodorant',
        categoryId: getCatId('cham-soc-ca-nhan'),
        description: 'Lăn khử mùi Dove dưỡng da mềm mịn.',
        price: 200000, stock: 180,
        brand: 'Dove', origin: 'USA', status: 'ACTIVE',
      },
    },
  ];

  let created = 0;
  for (const { slug, image, data } of defaultProducts) {
    if (!data.categoryId) continue;

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      const product = await prisma.product.create({ data: { ...data, slug } });
      // Gắn ảnh thực tế
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: image,
          isPrimary: true,
        },
      });
      created++;
    } else {
      // Sản phẩm đã tồn tại → cập nhật ảnh về default (fix ảnh bị mất khi deploy)
      const existingImage = await prisma.productImage.findFirst({
        where: { productId: existing.id, isPrimary: true },
      });
      if (!existingImage) {
        // Chưa có ảnh → tạo mới
        await prisma.productImage.create({
          data: {
            productId: existing.id,
            imageUrl: image,
            isPrimary: true,
          },
        });
        console.log(`  📷 Thêm ảnh cho "${existing.name}"`);
      } else if (existingImage.imageUrl !== image) {
        // Ảnh đang trỏ tới file random (upload cũ bị mất) → reset về default
        await prisma.productImage.update({
          where: { id: existingImage.id },
          data: { imageUrl: image },
        });
        console.log(`  🔄 Reset ảnh cho "${existing.name}" → ${image}`);
      }
    }
  }

  if (created > 0) console.log(`✅ Tạo ${created} sản phẩm mẫu mới`);
  else console.log('⏭️  Tất cả sản phẩm mẫu đã tồn tại, bỏ qua');
}

async function main() {
  console.log('🌱 Running safe seed...');
  console.log('   (Sẽ bỏ qua nếu data đã tồn tại)\n');

  await seedAdmin();
  await seedCategories();
  await seedProducts();

  console.log('\n🎉 Seed hoàn tất!');
  console.log('📝 Admin login: admin@healthstore.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
