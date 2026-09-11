from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# In-memory storage: fine for a single instance (which is what the
# Starter plan runs). If this service is ever scaled to multiple
# instances, switch to a shared backend (e.g. Redis) so limits are
# enforced consistently across them.
limiter = Limiter(key_func=get_remote_address)
