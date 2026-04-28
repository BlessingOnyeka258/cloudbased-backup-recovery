from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Device, Snapshot, AuditLog
from datetime import datetime, timedelta
import os
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-recovery-key'
# Fallback to SQLite if DATABASE_URL is not set
db_url = os.environ.get('DATABASE_URL', 'sqlite:///cloud_recover.db')
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# --- Ensure Tables are created in Production ---
try:
    with app.app_context():
        print("Initializing database...")
        db.create_all()
        seed_data()
        print("Database initialization complete.")
except Exception as e:
    print(f"Database initialization skipped or failed: {e}")

# --- Database Seeding ---
def seed_data():
    try:
        if User.query.first():
            return

        print("Seeding database...")
        admin = User(username='admin', password='password123', role='System Admin')
        db.session.add(admin)
        db.session.commit()

        device_types = ['Workstation', 'Laptop', 'Server', 'Mobile']
        device_names = ['Workstation-HQ-01', 'Manager-Laptop', 'Sales-Mobile-04', 'Dev-Ubuntu-Srv', 'Reception-PC']
        
        for name in device_names:
            device = Device(
                name=name,
                type=random.choice(device_types),
                storage=f"{random.randint(10, 500)} GB",
                health=random.randint(80, 100),
                user_id=admin.id
            )
            db.session.add(device)
            db.session.commit()

            # Add initial backups
            for i in range(3):
                snapshot = Snapshot(
                    device_id=device.id,
                    status='successful',
                    size=f"{random.uniform(1.0, 10.0):.1f} GB",
                    health=device.health - random.randint(0, 5),
                    timestamp=datetime.utcnow() - timedelta(days=i+1)
                )
                db.session.add(snapshot)

        # Initial Audit Logs
        logs = [
            AuditLog(action='SYSTEM_INIT', details='Flask-based recovery system initialized.'),
            AuditLog(action='USER_LOGIN', details='Admin session established.'),
            AuditLog(action='DATABASE_MIGRATE', details='Schema migrated to SQLAlchemy production structure.')
        ]
        for log in logs:
            db.session.add(log)
        
        db.session.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Seeding error: {e}")

# --- Routes ---

@app.route('/')
def index():
    if not session.get('logged_in'):
        return render_template('login.html')
    return render_template('dashboard.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and user.password == password: # In production, use hashing!
        session['logged_in'] = True
        session['username'] = username
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/api/devices')
def get_devices():
    devices = Device.query.all()
    return jsonify([{
        'id': d.id,
        'name': d.name,
        'type': d.type,
        'status': d.status,
        'lastSync': d.last_sync.strftime('%Y-%m-%d %H:%M:%S'),
        'storage': d.storage,
        'health': d.health
    } for d in devices])

@app.route('/api/backups')
def get_backups():
    backups = Snapshot.query.join(Device).all()
    return jsonify([{
        'id': b.id,
        'device': b.device.name,
        'status': b.status,
        'size': b.size,
        'health': b.health,
        'timestamp': b.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for b in backups])

@app.route('/api/logs')
def get_logs():
    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).all()
    return jsonify([{
        'id': l.id,
        'action': l.action,
        'details': l.details,
        'user': l.user,
        'timestamp': l.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for l in logs])

@app.route('/api/devices', methods=['POST'])
def add_device():
    data = request.get_json()
    name = data.get('name')
    device_type = data.get('type')
    storage = data.get('storage')
    
    user = User.query.filter_by(username=session.get('username')).first()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    new_device = Device(
        name=name,
        type=device_type,
        storage=storage,
        health=100,
        user_id=user.id
    )
    
    log = AuditLog(
        action='DEVICE_REGISTERED',
        details=f"New device registered: {name} ({device_type})",
        user=user.username
    )
    
    db.session.add(new_device)
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'success': True, 'device': {
        'id': new_device.id,
        'name': new_device.name,
        'type': new_device.type,
        'status': new_device.status,
        'storage': new_device.storage,
        'health': new_device.health
    }})

@app.route('/api/logs', methods=['POST'])
def add_log():
    data = request.get_json()
    action = data.get('action')
    details = data.get('details')
    user = session.get('username', 'System')
    
    new_log = AuditLog(action=action, details=details, user=user)
    db.session.add(new_log)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/sync/<device_id>', methods=['POST'])
def sync_device(device_id):
    device = Device.query.get(device_id)
    if device:
        snapshot = Snapshot(
            device_id=device.id,
            status='successful',
            size=f"{random.uniform(1.0, 5.0):.1f} GB",
            health=device.health
        )
        device.last_sync = datetime.utcnow()
        log = AuditLog(action='BACKUP_CREATED', details=f"Backup for {device.name} triggered manually.")
        db.session.add(snapshot)
        db.session.add(log)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
