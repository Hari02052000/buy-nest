"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const entities_1 = require("../../domain/entities");
const order_model_1 = __importDefault(require("../model/order.model"));
class OrderRepository {
    getAllOrders(limit, skip, paymentStatus, orderStatus, paymentMethod, appliedCoupon) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {};
                if (paymentStatus) {
                    query["paymentInfo.paymentStatus"] = paymentStatus;
                }
                if (orderStatus) {
                    query["orderStatus"] = orderStatus;
                }
                if (paymentMethod) {
                    query["paymentInfo.method"] = paymentMethod;
                }
                if (appliedCoupon) {
                    query["appliedCoupon"] = appliedCoupon;
                }
                const orders = yield order_model_1.default.find(query).limit(limit).skip(skip);
                return orders.map((order) => this.mapToOrder(order));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newOrder = new order_model_1.default({
                    items: order.items,
                    address: order.address,
                    user: order.user,
                    paymentInfo: order.paymentInfo,
                    orderStatus: order.orderStatus,
                    appliedCoupon: order.appliedCoupon,
                });
                yield newOrder.save();
                const populatedOrder = yield order_model_1.default.findById(newOrder.id).populate("address").populate("user");
                return this.mapToOrder(populatedOrder);
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield order_model_1.default.findById(id)
                .populate("user")
                .populate("items.productId")
                .populate("address");
            if (!order)
                throw new entities_1.ValidationError();
            return this.mapToOrder(order);
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield order_model_1.default.find({
                    user: userId,
                })
                    .populate("items.productId")
                    .populate("address")
                    .sort({ createdAt: -1 });
                return orders.map((order) => this.mapToOrder(order));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    findByStatus(status) {
        throw new Error("Method not implemented.");
    }
    update(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedFields = order.modifiedFields;
                if (Object.keys(modifiedFields).length === 0)
                    throw new entities_1.ValidationError();
                const updatedFields = {};
                for (const key in modifiedFields) {
                    if (modifiedFields.hasOwnProperty(key)) {
                        const fieldKey = key;
                        if (modifiedFields[fieldKey]) {
                            updatedFields[fieldKey] = order[fieldKey];
                        }
                    }
                }
                if (updatedFields.updatedAt)
                    delete updatedFields.updatedAt;
                yield order_model_1.default.findByIdAndUpdate(order.id, updatedFields);
                order.clearModifiedFields;
                const updatedOrder = yield this.findById(order.id);
                return updatedOrder;
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    mapToOrder(orderDb) {
        const items = orderDb.items.map((item) => {
            const orderItem = {
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                productId: (() => {
                    var _a, _b;
                    const product = item.productId;
                    if (typeof product === "object" &&
                        product !== null &&
                        "brandName" in product &&
                        "modelName" in product &&
                        "price" in product) {
                        const dbItem = product;
                        return {
                            id: (_a = dbItem.id) !== null && _a !== void 0 ? _a : (_b = dbItem._id) === null || _b === void 0 ? void 0 : _b.toString(),
                            brandName: dbItem.brandName,
                            modelName: dbItem.modelName,
                            images: dbItem.images,
                            price: dbItem.price,
                            description: dbItem.description,
                        };
                    }
                    return product.toString(); // fallback: unpopulated ObjectId
                })(),
            };
            return orderItem;
        });
        const address = (() => {
            var _a, _b;
            const addr = orderDb.address;
            if (typeof addr === "object" &&
                addr !== null &&
                "addressLine1" in addr &&
                "city" in addr &&
                "country" in addr) {
                const dbAddress = addr;
                return {
                    id: (_a = dbAddress.id) !== null && _a !== void 0 ? _a : (_b = dbAddress._id) === null || _b === void 0 ? void 0 : _b.toString(),
                    addressLine1: dbAddress.addressLine1,
                    city: dbAddress.city,
                    country: dbAddress.country,
                    fullName: dbAddress.fullName,
                };
            }
            return addr.toString();
        })();
        const user = (() => {
            var _a, _b;
            const usr = orderDb.user;
            if (typeof usr === "object" && usr !== null && "email" in usr) {
                const dbUser = usr;
                return {
                    id: (_a = dbUser.id) !== null && _a !== void 0 ? _a : (_b = dbUser._id) === null || _b === void 0 ? void 0 : _b.toString(),
                    email: dbUser.email,
                };
            }
            return usr.toString();
        })();
        const order = new entities_1.Order(orderDb.id, items, address, user, orderDb.paymentInfo.method, orderDb.paymentInfo.payableAmount);
        order.paymentInfo = orderDb.paymentInfo;
        order.orderStatus = orderDb.orderStatus;
        return order;
    }
}
exports.OrderRepository = OrderRepository;
