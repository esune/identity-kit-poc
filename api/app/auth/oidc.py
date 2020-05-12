from flask_pyoidc.provider_configuration import (  # ProviderMetadata,
    ClientMetadata,
    ProviderConfiguration,
)

from config import Config


def get_oidc_config():
    return ProviderConfiguration(
        issuer=Config.OIDC_ISSUER,
        client_metadata=ClientMetadata(
            client_id=Config.OIDC_CLIENT,
            client_secret=Config.OIDC_SECRET,
            post_logout_redirect_uris=[Config.OIDC_POST_LOGOUT_REDIRECT_URI],
        ),
    )
