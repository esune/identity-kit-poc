from flask_pyoidc.provider_configuration import (  # ProviderMetadata,
    ClientMetadata,
    ProviderConfiguration,
    # ProviderMetadata
)

from config import Config


def get_oidc_config():
    return ProviderConfiguration(
        issuer=Config.OIDC_ISSUER,
        # provider_metadata=ProviderMetadata(
        #     issuer=Config.OIDC_ISSUER,
        #     authorization_endpoint=f"{Config.OIDC_ISSUER}/protocol/openid-connect/auth",
        #     jwks_uri=f"{Config.OIDC_ISSUER}/protocol/openid-connect/certs",
        #     end_session_endpoint=f"{Config.OIDC_ISSUER}/protocol/openid-connect/logout",
        #     token_endpoint=f"{Config.OIDC_ISSUER}/protocol/openid-connect/token"),
        client_metadata=ClientMetadata(
            client_id=Config.OIDC_CLIENT, client_secret=Config.OIDC_SECRET,
        ),
    )
