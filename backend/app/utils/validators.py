"""
FitBite AI - Input Validators
Validation utilities for API inputs
"""
import re
from typing import Optional


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_image_size(size_bytes: int, max_mb: int = 10) -> bool:
    """Validate image file size."""
    return size_bytes <= max_mb * 1024 * 1024


def validate_image_type(content_type: str) -> bool:
    """Validate image MIME type."""
    allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    return content_type in allowed


def sanitize_string(value: str, max_length: int = 200) -> str:
    """Sanitize string input."""
    return value.strip()[:max_length]


def validate_portion_grams(grams: float) -> bool:
    """Validate portion size."""
    return 1 <= grams <= 2000
