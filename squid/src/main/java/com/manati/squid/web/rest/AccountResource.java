package com.manati.squid.web.rest;

import com.manati.squid.domain.Business;
import com.manati.squid.domain.User;
import com.manati.squid.domain.UserDetails;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.UserDetailsRepository;
import com.manati.squid.repository.UserRepository;
import com.manati.squid.security.SecurityUtils;
import com.manati.squid.service.MailService;
import com.manati.squid.service.UserService;
import com.manati.squid.service.dto.AdminUserDTO;
import com.manati.squid.service.dto.PasswordChangeDTO;
import com.manati.squid.service.dto.UserDTO;
import com.manati.squid.web.rest.errors.*;
import com.manati.squid.web.rest.vm.KeyAndPasswordVM;
import com.manati.squid.web.rest.vm.ManagedUserVM;
import java.net.URISyntaxException;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private static class AccountResourceException extends RuntimeException {

        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    private final UserRepository userRepository;

    private final UserDetailsRepository userDetailsRepository;

    private final UserService userService;

    private final MailService mailService;

    private static final String ENTITY_NAME = "user";

    private static final String applicationName = "squid";

    public AccountResource(
        UserRepository userRepository,
        UserDetailsRepository userDetailsRepository,
        UserService userService,
        MailService mailService
    ) {
        this.userRepository = userRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.userService = userService;
        this.mailService = mailService;
    }

    /**
     * {@code POST  /register} : register the user.
     *
     * @param managedUserVM the managed user View Model.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already used.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        if (isPasswordLengthInvalid(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
        mailService.sendActivationEmail(user);
    }

    @PostMapping(value = "/register", params = { "identification", "phone" })
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(
        @Valid @RequestBody ManagedUserVM managedUserVM,
        @RequestParam("identification") String identification,
        @RequestParam("phone") String phone
    ) {
        if (isPasswordLengthInvalid(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());
        UserDetails userDetails = new UserDetails();
        userDetails.setIdentification(identification);
        userDetails.setPhone(phone);
        userDetails.setInternalUser(user);
        userDetailsRepository.save(userDetails);
        mailService.sendActivationEmail(user);
    }

    @PostMapping(value = "/register-operator", params = { "identification", "phone", "businessId" })
    @ResponseStatus(HttpStatus.CREATED)
    public void registerOperator(
        @Valid @RequestBody ManagedUserVM managedUserVM,
        @RequestParam("identification") String identification,
        @RequestParam("phone") String phone,
        @RequestParam("businessId") Long businessId
    ) {
        if (isPasswordLengthInvalid(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }

        if (managedUserVM.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
            // Lowercase the user login before comparing with database
        } else if (userRepository.findOneByLogin(managedUserVM.getLogin().toLowerCase()).isPresent()) {
            throw new LoginAlreadyUsedException();
        } else if (userRepository.findOneByEmailIgnoreCase(managedUserVM.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        } else {
            //Authority role = new Authority();
            //role.setName("ROLE_OPERATOR");
            Set<String> authorities = new HashSet<>();
            authorities.add("ROLE_OPERATOR");
            managedUserVM.setAuthorities(authorities);
            String passwordUser = generarPassword();
            managedUserVM.setPassword(passwordUser);
            //Monica's greatest bug
            //managedUserVM.setImageUrl("./content/images/default-avatar.png");
            User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());

            UserDetails userDetails = new UserDetails();
            Business business = new Business();
            Status operatorStatus = Status.Pending;

            business.setId(businessId);

            userDetails.setIdentification(identification);
            userDetails.setPhone(phone);
            userDetails.setInternalUser(user);
            userDetails.setStatus(operatorStatus);
            userDetails.setBusiness(business);
            userDetailsRepository.save(userDetails);

            user.setPassword(passwordUser);
            mailService.sendActivationEmailOperator(user);
        }
    }

    public String generarPassword() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        String contrasenna;
        int longitud = 8;
        StringBuilder builder = new StringBuilder(longitud);
        for (int i = 0; i < longitud; i++) {
            builder.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        contrasenna = builder.toString();
        return contrasenna;
    }

    @PutMapping(value = "/update-user/{id}", params = { "identification", "phone" })
    public void updateUserDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody User user,
        @RequestParam("identification") String identification,
        @RequestParam("phone") String phone
    ) throws URISyntaxException {
        log.debug("REST request to update UserDetails : {}, {}", id, user);
        if (user.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (!userRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        //Changing to using the service, instead of repository, so it handles clear cache
        userService.updateUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getLangKey(), user.getImageUrl());

        Optional<UserDetails> resultUserDetails = userDetailsRepository.findByInternalUser_Id(id);
        UserDetails userDetails = resultUserDetails.get();
        userDetails.setPhone(phone);
        userDetails.setIdentification(identification);
        userDetailsRepository.save(userDetails);
    }

    /**
     * {@code PUT  /register} : update operator.
     *
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already used.
     */
    @PutMapping(value = "/update-operator/{id}", params = { "identification", "phone", "businessId" })
    public void updateOperator(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody User user,
        @RequestParam("identification") String identification,
        @RequestParam("phone") String phone,
        @RequestParam("businessId") Long businessId
    ) throws URISyntaxException {
        log.debug("REST request to update UserDetails : {}, {}", id, user);
        if (user.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (!userRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<User> resultUser = userRepository.findById(id);
        User createdUser = resultUser.get();
        createdUser.setLogin(user.getLogin());
        createdUser.setFirstName(user.getFirstName());
        createdUser.setLastName(user.getLastName());
        createdUser.setEmail(user.getEmail());
        createdUser.setActivated(true);
        userRepository.save(createdUser);

        Business business = new Business();
        business.setId(businessId);

        Optional<UserDetails> resultUserDetails = userDetailsRepository.findByInternalUser_Id(id);
        UserDetails userDetails = resultUserDetails.get();
        userDetails.setPhone(phone);
        userDetails.setIdentification(identification);
        userDetails.setBusiness(business);
        userDetailsRepository.save(userDetails);
    }

    /**
     * {@code GET  /activate} : activate the registered user.
     *
     * @param key the activation key.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be activated.
     */
    @GetMapping("/activate")
    public void activateAccount(@RequestParam(value = "key") String key) {
        Optional<User> user = userService.activateRegistration(key);
        if (!user.isPresent()) {
            throw new AccountResourceException("No user was found for this activation key");
        }
    }

    /**
     * {@code GET  /authenticate} : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request.
     * @return the login if the user is authenticated.
     */
    @GetMapping("/authenticate")
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    @GetMapping("/account")
    public AdminUserDTO getAccount() {
        return userService
            .getUserWithAuthorities()
            .map(AdminUserDTO::new)
            .orElseThrow(() -> new AccountResourceException("User could not be found"));
    }

    /**
     * {@code POST  /account} : update the current user information.
     *
     * @param userDTO the current user information.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user login wasn't found.
     */
    @PostMapping("/account")
    public void saveAccount(@Valid @RequestBody AdminUserDTO userDTO) {
        String userLogin = SecurityUtils
            .getCurrentUserLogin()
            .orElseThrow(() -> new AccountResourceException("Current user login not found"));
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getLogin().equalsIgnoreCase(userLogin))) {
            throw new EmailAlreadyUsedException();
        }
        Optional<User> user = userRepository.findOneByLogin(userLogin);
        if (!user.isPresent()) {
            throw new AccountResourceException("User could not be found");
        }
        userService.updateUser(
            userDTO.getFirstName(),
            userDTO.getLastName(),
            userDTO.getEmail(),
            userDTO.getLangKey(),
            userDTO.getImageUrl()
        );
    }

    /**
     * {@code POST  /account/change-password} : changes the current user's password.
     *
     * @param passwordChangeDto current and new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the new password is incorrect.
     */
    @PostMapping(path = "/account/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDto) {
        if (isPasswordLengthInvalid(passwordChangeDto.getNewPassword())) {
            throw new InvalidPasswordException();
        }

        userService.changePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword());
    }

    /**
     * {@code POST   /account/reset-password/init} : Send an email to reset the password of the user.
     *
     * @param mail the mail of the user.
     */
    @PostMapping(path = "/account/reset-password/init")
    public void requestPasswordReset(@RequestBody String mail) {
        Optional<User> user = userService.requestPasswordReset(mail);
        if (user.isPresent()) {
            mailService.sendPasswordResetMail(user.get());
        } else {
            // Pretend the request has been successful to prevent checking which emails really exist
            // but log that an invalid attempt has been made
            log.warn("Password reset requested for non existing mail");
        }
    }

    /**
     * {@code POST   /account/reset-password/finish} : Finish to reset the password of the user.
     *
     * @param keyAndPassword the generated key and the new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the password could not be reset.
     */
    @PostMapping(path = "/account/reset-password/finish")
    public void finishPasswordReset(@RequestBody KeyAndPasswordVM keyAndPassword) {
        if (isPasswordLengthInvalid(keyAndPassword.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        Optional<User> user = userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey());

        if (!user.isPresent()) {
            throw new AccountResourceException("No user was found for this reset key");
        }
    }

    private static boolean isPasswordLengthInvalid(String password) {
        return (
            StringUtils.isEmpty(password) ||
            password.length() < ManagedUserVM.PASSWORD_MIN_LENGTH ||
            password.length() > ManagedUserVM.PASSWORD_MAX_LENGTH
        );
    }
}
