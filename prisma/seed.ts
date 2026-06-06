import "dotenv/config";
import {
  Role,
  Provider,
  EmployeeType,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  PickupStatus,
  DeliveryStatus,
  ComplaintType,
} from "../generated/prisma/client.js";
import * as argon2 from "argon2";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  // Hash the password with argon2
  const hashedPassword = await argon2.hash("password123");

  // Create a user with hashed password
  const user = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      password: hashedPassword,
      fullName: "John Doe",
      role: Role.USER,
      provider: Provider.CREDENTIALS,
      verifiedAt: new Date(),
      address: {
        create: [
          {
            address: "Jl. Sudirman No. 1",
            city: "Jakarta",
            label: "Home",
            postalCode: "10220",
            latitude: 6.2088,
            longitude: 106.8456,
            isPrimary: true,
          },
        ],
      },
    },
    include: {
      address: true,
    },
  });

  // Create an outlet
  const outlet = await prisma.outlet.create({
    data: {
      name: "Laundry Express",
      address: "Jl. Thamrin No. 10",
      city: "Jakarta",
      postalCode: "10340",
      latitude: 6.21,
      longitude: 106.82,
    },
  });

  // Create an employee linked to the user and outlet
  const employee = await prisma.employee.create({
    data: {
      type: EmployeeType.WORKER,
      salary: 5000000,
      userId: user.id,
      outletId: outlet.id,
    },
  });

  // Create an order
  const order = await prisma.order.create({
    data: {
      scheduledTime: new Date(),
      orderStatus: OrderStatus.PENDING,
      deliveryCost: 20000,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.VISA,
      distance: 5.5,
      userId: user.id,
      outletId: outlet.id,
      addressId: user.address[0].id,
      orderItems: {
        create: [
          {
            name: "Shirt",
            quantity: 3,
            weight: 500,
            price: 15000,
            description: "Cotton shirts",
          },
          {
            name: "Pants",
            quantity: 2,
            weight: 1000,
            price: 25000,
            description: "Jeans",
          },
        ],
      },
    },
  });

  // Create a pickup for the order
  await prisma.orderPickup.create({
    data: {
      status: PickupStatus.WAITING_FOR_DRIVER,
      orderId: order.id,
      driverId: employee.id,
    },
  });

  // Create a delivery for the order
  await prisma.orderDelivery.create({
    data: {
      status: DeliveryStatus.WAITING_FOR_DRIVER,
      orderId: order.id,
      driverId: employee.id,
    },
  });

  // Create a complaint
  await prisma.complaint.create({
    data: {
      ticketNumber: 1001,
      complaintType: ComplaintType.DIRTY_CLOTHING,
      body: "My clothes were returned with stains.",
      customerId: user.id,
      orderId: order.id,
    },
  });

  // Create a notification
  const notification = await prisma.notification.create({
    data: {
      title: "Order Update",
      body: "Your order is now being processed.",
    },
  });

  await prisma.notificationsOnUsers.create({
    data: {
      userId: user.id,
      notificationId: notification.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
