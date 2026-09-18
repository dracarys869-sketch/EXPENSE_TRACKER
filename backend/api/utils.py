import jwt
from datetime import datetime, timedelta
from functools import wraps
from django.conf import settings
from django.http import JsonResponse
from api.models import User

def create_access_token(user_id):
    payload = {
        'sub': str(user_id),
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    token = jwt.encode(payload, settings.SIMPLE_JWT['SIGNING_KEY'], algorithm='HS256')
    return token

def decode_access_token(token):
    try:
        payload = jwt.decode(token, settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=['HS256'])
        return payload.get('sub')
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def jwt_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'message': 'Missing or invalid token.'}, status=401)
        
        token = auth_header.split(' ')[1]
        user_id_str = decode_access_token(token)
        if not user_id_str:
            return JsonResponse({'message': 'Invalid or expired token.'}, status=401)
        
        try:
            user = User.objects.get(id=int(user_id_str))
            request.user_obj = user
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found.'}, status=401)
            
        return view_func(request, *args, **kwargs)
    return wrapped_view


def admin_required(view_func):
    @wraps(view_func)
    @jwt_required
    def wrapped_view(request, *args, **kwargs):
        if not request.user_obj.is_admin or not request.user_obj.is_active:
            return JsonResponse({'message': 'Administrator access required.'}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapped_view
