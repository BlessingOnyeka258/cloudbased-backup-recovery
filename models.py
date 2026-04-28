from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), default='System Admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    devices = db.relationship('Device', backref='user', lazy=True)

class Device(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='online')
    last_sync = db.Column(db.DateTime, default=datetime.utcnow)
    storage = db.Column(db.String(50), nullable=False)
    health = db.Column(db.Integer, default=100)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    snapshots = db.relationship('Snapshot', backref='device', lazy=True)

class Snapshot(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    device_id = db.Column(db.String(36), db.ForeignKey('device.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='successful')
    size = db.Column(db.String(50), nullable=False)
    health = db.Column(db.Integer, nullable=False)

class AuditLog(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    action = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.Column(db.String(80), default='System Admin')
