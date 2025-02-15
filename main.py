# app.py
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS



# Инициализация приложения и базы данных
app = Flask(__name__)
CORS(app)  # Разрешаем кросс-доменные запросы
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pizza_orders.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/bulder')
def bulder():
    return render_template('pizza_construkt.html')

@app.route('/login')
def login():
    return render_template('login.html')

# Модели базы данных
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    comments = db.Column(db.Text)
    payment_method = db.Column(db.String(50), nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)

# Маршруты API
@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Проверка обязательных полей
        required_fields = ['customer', 'payment', 'items', 'total_price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Проверка метода оплаты
        if 'method' not in data['payment'] or not data['payment']['method']:
            return jsonify({'error': 'Payment method is required'}), 400

        # Проверка данных клиента
        customer = data['customer']
        required_customer_fields = ['name', 'address', 'phone']
        for field in required_customer_fields:
            if not customer.get(field):
                return jsonify({'error': f'Missing customer field: {field}'}), 400

        # Создание заказа
        new_order = Order(
            customer_name=customer['name'],
            address=customer['address'],
            phone=customer['phone'],
            comments=customer.get('comments', ''),
            payment_method=data['payment']['method'],  # Сохраняем метод оплаты
            total_price=data['total_price']
        )
        
        db.session.add(new_order)
        db.session.commit()

        # Добавление элементов заказа
        for item in data['items']:
            order_item = OrderItem(
                category=item.get('category', ''),
                name=item.get('name', ''),
                price=item.get('price', 0),
                order_id=new_order.id
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({'message': 'Order created', 'order_id': new_order.id}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Помилка: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify([{
            'id': order.id,
            'customer_name': order.customer_name,
            'total_price': order.total_price,
            'order_date': order.order_date.isoformat()
        } for order in orders]), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        items = OrderItem.query.filter_by(order_id=order_id).all()
        
        return jsonify({
            'order': {
                'id': order.id,
                'customer_name': order.customer_name,
                'address': order.address,
                'phone': order.phone,
                'comments': order.comments,
                'payment_method': order.payment_method,
                'total_price': order.total_price,
                'order_date': order.order_date.isoformat()
            },
            'items': [{
                'category': item.category,
                'name': item.name,
                'price': item.price
            } for item in items]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 404

# Запуск приложения
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)