from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

_supabase_client: Optional[Client] = None
_supabase_admin_client: Optional[Client] = None

def get_supabase() -> Optional[Client]:
    """
    Returns initialized public client for Supabase using anon key.
    """
    global _supabase_client
    if _supabase_client is None:
        if settings.SUPABASE_URL and settings.SUPABASE_KEY and "your-project" not in settings.SUPABASE_URL:
            try:
                _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception as e:
                print(f"[Supabase Client Warning] Could not initialize client: {e}")
                return None
    return _supabase_client

def get_supabase_admin() -> Optional[Client]:
    """
    Returns initialized service-role admin client for Supabase (Server-side only!).
    Never exposed to client-side frontend code.
    """
    global _supabase_admin_client
    if _supabase_admin_client is None:
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY and "your-project" not in settings.SUPABASE_URL:
            try:
                _supabase_admin_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
            except Exception as e:
                print(f"[Supabase Admin Warning] Could not initialize admin client: {e}")
                return None
    return _supabase_admin_client

def is_supabase_live() -> bool:
    return get_supabase() is not None
