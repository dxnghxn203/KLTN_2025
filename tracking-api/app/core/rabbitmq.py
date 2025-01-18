
import pika
import os

def get_rabbitmq_channel():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(os.getenv('RABBITMQ_URL', 'localhost'))
    )
    channel = connection.channel()
    channel.queue_declare(queue='tracking_events')
    return connection, channel