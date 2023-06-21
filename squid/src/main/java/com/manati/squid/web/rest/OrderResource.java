package com.manati.squid.web.rest;

import com.manati.squid.domain.*;
import com.manati.squid.domain.*;
import com.manati.squid.domain.Business;
import com.manati.squid.domain.Catalog;
import com.manati.squid.domain.Location;
import com.manati.squid.domain.Order;
import com.manati.squid.domain.User;
import com.manati.squid.domain.UserDetails;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.*;
import com.manati.squid.repository.CatalogRepository;
import com.manati.squid.repository.OrderRepository;
import com.manati.squid.repository.UserDetailsRepository;
import com.manati.squid.repository.UserRepository;
import com.manati.squid.service.DashboardService;
import com.manati.squid.service.MailService;
import com.manati.squid.service.PDFService;
import com.manati.squid.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.checkerframework.checker.nullness.Opt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.Order}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderResource {

    private final Logger log = LoggerFactory.getLogger(OrderResource.class);

    private static final String ENTITY_NAME = "order";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderRepository orderRepository;

    private final UserDetailsRepository userDetailsRepository;

    private final FileRepository fileRepository;

    private final CatalogRepository catalogRepository;

    private final UserRepository userRepository;
    private final DashboardService dashboardService;
    private final MailService mailService;

    private final PDFService pdfService;

    private final APPRepository appRepository;

    private final SeoRecordRepository seoRecordRepository;

    public OrderResource(
        OrderRepository orderRepository,
        UserDetailsRepository userDetailsRepository,
        CatalogRepository catalogRepository,
        FileRepository fileRepository,
        UserRepository userRepository,
        APPRepository appRepository,
        PDFService pdfService,
        SeoRecordRepository seoRecordRepository,
        DashboardService dashboardService,
        MailService mailService
    ) {
        this.orderRepository = orderRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.catalogRepository = catalogRepository;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.pdfService = pdfService;
        this.appRepository = appRepository;
        this.seoRecordRepository = seoRecordRepository;
        this.dashboardService = dashboardService;
        this.mailService = mailService;
    }

    /**
     * {@code POST  /orders} : Create a new order.
     *
     * @param order the order to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new order, or with status {@code 400 (Bad Request)} if the order has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) throws URISyntaxException {
        log.debug("REST request to save Order : {}", order);
        if (order.getId() != null) {
            throw new BadRequestAlertException("A new order cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Order result = orderRepository.save(order);
        return ResponseEntity
            .created(new URI("/api/orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /orders/:id} : Updates an existing order.
     *
     * @param id the id of the order to save.
     * @param order the order to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/orders/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable(value = "id", required = false) final Long id, @RequestBody Order order)
        throws URISyntaxException {
        log.debug("REST request to update Order : {}, {}", id, order);
        if (order.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, order.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Order> oldOrder = orderRepository.findById(id);

        if (order.getStatus().getId() == 31) {
            if (order.getStatus().getId() != oldOrder.get().getStatus().getId()) {
                mailService.sendFinishedAppointmentEmail(order.getVehicle().getUser());
            }
        }

        if (order.getStatus().getId() == 58) {
            if (order.getStatus().getId() != oldOrder.get().getStatus().getId()) {
                mailService.sendInsuranceEmail(order.getVehicle().getUser());
            }
        }

        if (order.getStatus().getId() == 29) {
            if (order.getStatus().getId() != oldOrder.get().getStatus().getId()) {
                mailService.sendCanceledAppointmentEmail(order.getVehicle().getUser());
            }
        }

        Order result = orderRepository.save(order);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, order.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /orders/:id} : Partial updates given fields of an existing order, field will ignore if it is null
     *
     * @param id the id of the order to save.
     * @param order the order to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 404 (Not Found)} if the order is not found,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/orders/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Order> partialUpdateOrder(@PathVariable(value = "id", required = false) final Long id, @RequestBody Order order)
        throws URISyntaxException {
        log.debug("REST request to partial update Order partially : {}, {}", id, order);
        if (order.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, order.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Order> result = orderRepository
            .findById(order.getId())
            .map(
                existingOrder -> {
                    if (order.getStartDate() != null) {
                        existingOrder.setStartDate(order.getStartDate());
                    }
                    if (order.getEndDate() != null) {
                        existingOrder.setEndDate(order.getEndDate());
                    }
                    if (order.getTotalCost() != null) {
                        existingOrder.setTotalCost(order.getTotalCost());
                    }
                    if (order.getComission() != null) {
                        existingOrder.setComission(order.getComission());
                    }

                    return existingOrder;
                }
            )
            .map(orderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, order.getId().toString())
        );
    }

    /**
     * {@code GET  /orders} : get all the orders.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orders in body.
     */
    @GetMapping("/orders")
    public List<Order> getAllOrders(@RequestParam(required = false) String filter) {
        if ("orderrating-is-null".equals(filter)) {
            log.debug("REST request to get all Orders where orderRating is null");
            return StreamSupport
                .stream(orderRepository.findAll().spliterator(), false)
                .filter(order -> order.getOrderRating() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Orders");
        return orderRepository.findAll();
    }

    @GetMapping("/orders-sum")
    public Integer getAllOrdersSum() {
        log.debug("REST request to get orders sum comission");
        return orderRepository.getComissionTotal();
    }

    @GetMapping("/orders-sum-per-vehicle-brand")
    public List<List<String>> getAllOrdersSumVehicle() {
        log.debug("REST request to get orders sum by vehicle brand count");
        return dashboardService.getPopularBrandByOrders();
    }

    @GetMapping("/orders-percentage-by-status")
    public String getAllOrdersSumVehicle(@RequestParam(value = "status") String status) {
        log.debug("REST request to get orders percentage by status");
        return dashboardService.getPercentageOfOrdersStatus(status);
    }

    /**
     * {@code GET  /orders/:id} : get the "id" order.
     *
     * @param id the id of the order to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the order, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        log.debug("REST request to get Order : {}", id);
        Optional<Order> order = orderRepository.findById(id);

        //Add the files as it's not coming by default
        order.ifPresent(
            presentOrder -> {
                List<File> files = fileRepository.findFilesByOrder_Id(presentOrder.getId());
                files.forEach(
                    file -> {
                        presentOrder.addFile(file);
                    }
                );
            }
        );

        return ResponseUtil.wrapOrNotFound(order);
    }

    /**
     * {@code DELETE  /orders/:id} : delete the "id" order.
     *
     * @param id the id of the order to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        log.debug("REST request to delete Order : {}", id);
        orderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /orders} : get all the appointments.
     *
     * @param id the id of the operator
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orders in body.
     */
    @GetMapping("/appointments/{id}")
    public List<Order> getAllAppointments(@PathVariable Long id) {
        Optional<UserDetails> user = userDetailsRepository.findByInternalUser_Id(id);
        if (!user.isPresent()) {
            return null;
        }
        Long idBusiness = user.get().getBusiness().getId();
        List<Order> ordenes = orderRepository
            .findOrdersByBusinessId(idBusiness)
            .stream()
            .filter(order -> order.getStatus() != null)
            .filter(order -> order.getStatus().getId() == 28)
            .filter(order -> order.getBusiness() != null)
            .collect(Collectors.toList());
        return ordenes;
    }

    /**
     * {@code GET  /orders} : get all the orders in hold and in progress.
     *
     * @param id the id of the operator
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orders in body.
     */
    @GetMapping("/orders-calendar/{id}")
    public List<Order> getAllOrdersCalendar(@PathVariable Long id) {
        Optional<Order> orderResult = orderRepository.findById(id);
        if (!orderResult.isPresent()) {
            return null;
        }
        Long idBusiness = orderResult.get().getBusiness().getId();
        List<Order> ordenes = orderRepository
            .findOrdersByBusinessId(idBusiness)
            .stream()
            .filter(order -> order.getStatus() != null)
            .filter(order -> order.getStatus().getId() == 28 || order.getStatus().getId() == 30)
            .filter(order -> order.getBusiness() != null)
            .filter(order -> order.getId() != id)
            .collect(Collectors.toList());
        return ordenes;
    }

    /**
     * {@code PUT  /orders/:id} : Changes appointment to order
     *
     * @param id the id of the order to save.
     * @param IDOperator for the operator.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping(value = "/orders-to-appointment/{id}", params = { "idOperator" })
    public ResponseEntity<Order> updateAppointment(@PathVariable Long id, @RequestParam("idOperator") Long IDOperator) {
        log.debug("REST request to update Appointment to Order : {}, {}", id);
        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Optional<Order> order = orderRepository.findById(id);
        Order ordenToUse = order.get();
        Long l = new Long(30);
        Optional<Catalog> catalogo = catalogRepository.findById(l);

        Optional<User> operator = userRepository.findById(IDOperator);

        ordenToUse.setStatus(catalogo.get());
        ordenToUse.setOperator(operator.get());
        orderRepository.save(ordenToUse);

        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, ordenToUse.getId().toString()))
            .body(ordenToUse);
    }

    /**
     * {@code PUT  /orders/:id} :Payment´s order.
     *
     * @param id the id of the order to save.
     * @param order the order to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/orders-payment/{id}")
    public ResponseEntity<Order> paymentOfAnOrder(@PathVariable(value = "id", required = false) final Long id, @RequestBody Order order)
        throws URISyntaxException {
        log.debug("REST request to update Payment : {}, {}", id, order);
        if (order.getId() == null) {
            throw new BadRequestAlertException("ID invalido", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, order.getId())) {
            throw new BadRequestAlertException("ID invalido", ENTITY_NAME, "idinvalid");
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestAlertException("Order no encontrada", ENTITY_NAME, "intente de nuevo.");
        }

        Optional<Order> orderResult = orderRepository.findById(id);
        Order result = orderResult.get();
        Long l = new Long(32);
        Optional<Catalog> catalogo = catalogRepository.findById(l);
        Double seoCost = 0.0;

        pdfService.createPDF(result, "Factura.pdf");
        seoCost = SEOpendingPayment(result.getBusiness().getId(), result.getTotalCost());
        increaseTotalAppIncome(result.getTotalCost() + seoCost);

        if (result != null) {
            result.setStatus(catalogo.get());
            result = orderRepository.save(result);
        }

        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, order.getId().toString()))
            .body(result);
    }

    @GetMapping("/appointmentsBusinessId/{id}")
    public List<Order> getAllAppointmentsBusinessId(@PathVariable Long id) {
        log.debug("TRAE TODAS LAS CITAS DE UN COMERCIO");
        //Status businessStatus = Status.Enabled;
        return orderRepository.findOrdersByBusinessId(id);
    }

    @GetMapping("/appointmentsBusinessOp/{id}")
    public List<Order> getAllAppointmentsBusinessOperator(@PathVariable Long id) {
        log.debug("TODAS LAS CITAS DE UN OPERADOR");
        //Status businessStatus = Status.Enabled;
        return orderRepository.findOrdersByOperatorId(id);
    }

    @GetMapping("/orderByVehicle/{id}")
    public List<Order> getAllOrdersByVehicle(@PathVariable Long id) {
        log.debug("TODAS LAS ORDENES DE UN VEHICULO");
        //Status businessStatus = Status.Enabled;
        return orderRepository.findOrdersByVehicleId(id);
    }

    @GetMapping("/orderStatusInsurance/{id}")
    public List<Order> getAllOrdersByStatusInsurance(@PathVariable Long id) {
        log.debug("REST request all the orders with 'En avalúo status");
        return orderRepository.findOrdersByStatusId(id);
    }

    @GetMapping("/orders-calendar-by-id/{id}")
    public List<OrderCalendar> getAllOrdersCalendarById(@PathVariable Long id) {
        Optional<Order> orderResult = orderRepository.findById(id);
        if (!orderResult.isPresent()) {
            return null;
        }
        Long idBusiness = orderResult.get().getBusiness().getId();
        //OrderCalendar orderCalendar = new OrderCalendar();
        List<OrderCalendar> orderCalendars = new ArrayList<>();

        List<Order> ordenes = orderRepository
            .findOrdersByBusinessId(idBusiness)
            .stream()
            .filter(order -> order.getStatus() != null)
            .filter(order -> order.getStatus().getId() == 28 || order.getStatus().getId() == 30)
            .filter(order -> order.getBusiness() != null)
            .collect(Collectors.toList());

        for (Order o : ordenes) {
            if (o.getId() == id) {
                OrderCalendar orderCalendar = new OrderCalendar();
                orderCalendar.setId(o.getId());
                orderCalendar.setSubject("Cita nueva");
                orderCalendar.setStartTime(o.getStartDate());
                orderCalendar.setEndTime(o.getEndDate());
                orderCalendar.setAllDay(false);
                orderCalendar.setBlock(false);
                orderCalendar.setReadonly(false);
                orderCalendars.add(orderCalendar);
            } else {
                OrderCalendar orderCalendar = new OrderCalendar();
                orderCalendar.setId(o.getId());
                orderCalendar.setSubject("Cita registrada");
                orderCalendar.setStartTime(o.getStartDate());
                orderCalendar.setEndTime(o.getEndDate());
                orderCalendar.setAllDay(false);
                orderCalendar.setBlock(false);
                orderCalendar.setReadonly(true);
                orderCalendars.add(orderCalendar);
            }
        }
        return orderCalendars;
    }

    /*    @GetMapping("/appointmentsBusinessPO")
    public List<Order> getAllAppointmentsBusinessPO() {
        log.debug("REST request to get all the orders of a Businesses");
        //Status businessStatus = Status.Enabled;
        return orderRepository.findOrdersByBusinessIdAAndOperatorId(54, 69);
    }*/

    /*    @GetMapping(value = "/appointmentsBusinessPO") //@RequestParam("idOperator") Long idOperator
    public List<Order> getAllAppointmentsBusinessOperator() {
        log.debug("REST request to get all the orders of a Businesses");
        //Status businessStatus = Status.Enabled;
        int idOperator = 69;
        int idBusiness = 54;
        return orderRepository.findOrdersByBusinessIdAAndOperatorId(idBusiness, idOperator);
    }*/

    public void increaseTotalAppIncome(Double newIncome) {
        int myInt = 7;
        Long myLong = new Long(myInt);
        Optional<APP> app = appRepository.findById(myLong);
        double inc = 0;
        APP currentApp = app.get();

        if (currentApp != null) {
            currentApp.setIncome(currentApp.getIncome() + newIncome);
            appRepository.save(currentApp);
        }
    }

    public Double SEOpendingPayment(Long businessId, Double income) {
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int month = localDate.getMonthValue();
        int year = localDate.getYear();
        Status enabledStatus = Status.Enabled;
        Status pendingStatus = Status.Pending;
        int myInt = 7;
        Long myLong = new Long(myInt);
        Optional<APP> app = appRepository.findById(myLong);
        APP currentApp = app.get();
        Double seoIncome = 0.0;

        List<SeoRecord> historial = seoRecordRepository.findAllByBusiness_Id(businessId);
        if (historial.size() > 0) {
            for (SeoRecord s : historial) {
                if (s.getDate().getMonthValue() == month && s.getDate().getYear() == year && s.getStatus().equals(pendingStatus)) {
                    seoIncome = currentApp.getComission() * income;
                    s.setCost(seoIncome);
                    s.setStatus(enabledStatus);
                    seoRecordRepository.save(s);
                }
            }
        }
        return seoIncome;
    }
}
