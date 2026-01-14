// import { redisPublisher } from "./publisher";

import RedisPubliser from "./publisher";

interface Order {
  id: string;
  user_id: any;
  items: any;
  total_amount: any;
  status: string;
  created_at: string;
}

class OrderManager {
  private orders: Order[];
  publisher: RedisPubliser;

  constructor(publisher: RedisPubliser) {
    this.publisher = publisher;
    this.orders = [];
  }

  async createOrder(user_id: any, items: any, total_amount: any) {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      user_id,
      items,
      total_amount,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    this.orders.push(order);
    console.log(`Order created: ${order.id}`);

    await this.publisher.Publish("order:created", {
      order_id: order.id,
      order_userId: order.user_id,
      total_amount: order.total_amount,
      timestamp: order.created_at,
    });
  }
}

export default OrderManager;
