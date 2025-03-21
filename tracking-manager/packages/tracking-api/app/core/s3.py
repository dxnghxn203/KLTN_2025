import os

import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv
import time

from app.core import logger

load_dotenv()
AWS_ACCESS_KEY = "AKIATQPD67OQZ24E6UB7"
AWS_SECRET_KEY = "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"
AWS_S3_ENDPOINT = "s3.ap-southeast-2.amazonaws.com"
AWS_REGION = 'ap-southeast-2'
AWS_BUCKET="kltn2025"

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

# Test the connection by listing the buckets
try:
    response = s3_client.list_buckets()
    logger.info("Connected to S3. Buckets available:")
    for bucket in response['Buckets']:
        logger.info(f" - {bucket['Name']}")
except NoCredentialsError:
    logger.error("Credentials not available.")
except ClientError as e:
    logger.error(f"Failed to connect to S3: {e}")

def create_bucket_if_not_exists(bucket_name):
    try:
        # Check if the bucket exists
        response = s3_client.list_buckets()
        existing_buckets = [bucket['Name'] for bucket in response['Buckets']]

        if bucket_name in existing_buckets:
            logger.info(f"Bucket '{bucket_name}' already exists.")
            return True

        # Create the bucket
        s3_client.create_bucket(Bucket=bucket_name)
        logger.info(f"Bucket '{bucket_name}' created successfully.")
        return True

    except ClientError as e:
        logger.error(f"Error occurred: {e}")
        return False

def upload_file(file, folder: str):
    try:
        create_bucket_if_not_exists(AWS_BUCKET)
        # Construct the key with folder and file name
        name = str(int(time.time()))
        s3_key = f"{folder}/{name}"
        # Upload file to S3 bucket
        s3_client.upload_fileobj(file.file,AWS_BUCKET , s3_key)#, ExtraArgs={'ACL': 'public-read'})
        # Generate the file URL
        file_url = f"https://{AWS_BUCKET}.{AWS_S3_ENDPOINT}/{s3_key}"
        logger.info(f"File uploaded successfully: {file_url}")
        return file_url
    except NoCredentialsError:
        logger.error("S3 Credentials not available.")
    except Exception as e:
        logger.error(f"S3 Failed to upload file: {str(e)}")

