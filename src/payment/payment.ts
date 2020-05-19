import { ApiHandler } from '../interfaces/interfaces';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

const paymentService: PaymentService = new PaymentService();
const paymentController: PaymentController = new PaymentController(paymentService);

export const createOrder: ApiHandler = paymentController.createOrder;