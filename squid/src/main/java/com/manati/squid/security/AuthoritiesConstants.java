package com.manati.squid.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String OPERATOR = "ROLE_OPERATOR";

    public static final String BUSINESSADMIN = "ROLE_BUSINESS_ADMIN";

    private AuthoritiesConstants() {}
}
