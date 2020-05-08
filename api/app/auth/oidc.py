from flask import current_app
from flask_pyoidc import OIDCAuthentication
from flask_pyoidc.provider_configuration import (  # ProviderMetadata,
    ClientMetadata,
    ProviderConfiguration,
)

from config import Config

config = ProviderConfiguration(
    issuer=Config.OIDC_ISSUER,
    client_metadata=ClientMetadata(
        client_id=Config.OIDC_CLIENT, client_secret=Config.OIDC_SECRET,
    ),
)

auth = OIDCAuthentication({"default": config}, current_app)
