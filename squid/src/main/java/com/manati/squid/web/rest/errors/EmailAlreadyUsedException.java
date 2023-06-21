package com.manati.squid.web.rest.errors;

public class EmailAlreadyUsedException extends BadRequestAlertException {

    private static final long serialVersionUID = 1L;

    public EmailAlreadyUsedException() {
        super(
            ErrorConstants.EMAIL_ALREADY_USED_TYPE,
            "Correo electrónico ya en uso. Favor intentar de nuevo.",
            "userManagement",
            "emailexists"
        );
    }
}
