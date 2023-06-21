package com.manati.squid.web.rest;

import com.manati.squid.domain.*;
import com.manati.squid.domain.File;
import com.manati.squid.domain.ServiceOrder;
import com.manati.squid.repository.FileRepository;
import com.manati.squid.repository.OrderRepository;
import com.manati.squid.repository.ServiceOrderRepository;
import com.manati.squid.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.util.ArrayUtils;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.ServiceOrder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ServiceOrderResource {

    private final Logger log = LoggerFactory.getLogger(ServiceOrderResource.class);

    private static final String ENTITY_NAME = "serviceOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceOrderRepository serviceOrderRepository;
    private final FileRepository fileRepository;

    private final OrderRepository orderRepository;

    public ServiceOrderResource(
        ServiceOrderRepository serviceOrderRepository,
        FileRepository fileRepository,
        OrderRepository orderRepository
    ) {
        this.serviceOrderRepository = serviceOrderRepository;
        this.orderRepository = orderRepository;
        this.fileRepository = fileRepository;
    }

    /**
     * {@code POST  /service-orders} : Create a new serviceOrder.
     *
     * @param serviceOrder the serviceOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceOrder, or with status {@code 400 (Bad Request)} if the serviceOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-orders")
    public ResponseEntity<ServiceOrder> createServiceOrder(@RequestBody ServiceOrder serviceOrder) throws URISyntaxException {
        log.debug("REST request to save ServiceOrder : {}", serviceOrder);
        if (serviceOrder.getId() != null) {
            throw new BadRequestAlertException("A new serviceOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceOrder result = serviceOrderRepository.save(serviceOrder);
        return ResponseEntity
            .created(new URI("/api/service-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(false, ENTITY_NAME, "", result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-orders/:id} : Updates an existing serviceOrder.
     *
     * @param id the id of the serviceOrder to save.
     * @param serviceOrder the serviceOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceOrder,
     * or with status {@code 400 (Bad Request)} if the serviceOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-orders/{id}")
    public ResponseEntity<ServiceOrder> updateServiceOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceOrder serviceOrder
    ) throws URISyntaxException {
        log.debug("REST request to update ServiceOrder : {}, {}", id, serviceOrder);
        if (serviceOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ServiceOrder result = serviceOrderRepository.save(serviceOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", serviceOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /service-orders/:id} : Partial updates given fields of an existing serviceOrder, field will ignore if it is null
     *
     * @param id the id of the serviceOrder to save.
     * @param serviceOrder the serviceOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceOrder,
     * or with status {@code 400 (Bad Request)} if the serviceOrder is not valid,
     * or with status {@code 404 (Not Found)} if the serviceOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the serviceOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/service-orders/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ServiceOrder> partialUpdateServiceOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ServiceOrder serviceOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update ServiceOrder partially : {}, {}", id, serviceOrder);
        if (serviceOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, serviceOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!serviceOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ServiceOrder> result = serviceOrderRepository
            .findById(serviceOrder.getId())
            .map(
                existingServiceOrder -> {
                    if (serviceOrder.getStartDate() != null) {
                        existingServiceOrder.setStartDate(serviceOrder.getStartDate());
                    }
                    if (serviceOrder.getEndDate() != null) {
                        existingServiceOrder.setEndDate(serviceOrder.getEndDate());
                    }
                    if (serviceOrder.getDeductible() != null) {
                        existingServiceOrder.setDeductible(serviceOrder.getDeductible());
                    }
                    if (serviceOrder.getUpdatedCost() != null) {
                        existingServiceOrder.setUpdatedCost(serviceOrder.getUpdatedCost());
                    }
                    if (serviceOrder.getComment() != null) {
                        existingServiceOrder.setComment(serviceOrder.getComment());
                    }

                    return existingServiceOrder;
                }
            )
            .map(serviceOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", serviceOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /service-orders} : get all the serviceOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceOrders in body.
     */
    @GetMapping("/service-orders")
    public List<ServiceOrder> getAllServiceOrders() {
        log.debug("REST request to get all ServiceOrders");
        return serviceOrderRepository.findAll();
    }

    /**
     * {@code GET  /service-orders/:id} : get the "id" serviceOrder.
     *
     * @param id the id of the serviceOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-orders/{id}")
    public ResponseEntity<ServiceOrder> getServiceOrder(@PathVariable Long id) {
        log.debug("REST request to get ServiceOrder : {}", id);
        Optional<ServiceOrder> serviceOrder = serviceOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(serviceOrder);
    }

    /**
     * {@code GET  /service-orders-by-order/:id} : get the "id" serviceOrder.
     *
     * @param id the id of the serviceOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceOrder, or with status {@code 404 (Not Found)}.
     */

    @GetMapping("/service-orders-by-order/{id}")
    public List<ServiceOrder> getServiceOrderbyOrder(@PathVariable Long id) {
        log.debug("REST request to get ServiceOrderByOrderId : {}", id);
        List<ServiceOrder> sos = serviceOrderRepository.findServiceOrdersByOrder_Id(id);

        //Add the 'files' as they are not coming already for some reason
        sos.forEach(
            so -> {
                List<File> files = fileRepository.findFilesByServiceOrder_Id(so.getId());
                files.forEach(
                    file -> {
                        so.addFile(file);
                    }
                );
            }
        );

        return sos;
    }

    /**
     * {@code GET  /service-orders-by-order/:id} : get the "id" serviceOrder.
     *
     * @param id the id of the serviceOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceOrder, or with status {@code 404 (Not Found)}.
     */

    @GetMapping("/service-orders-by-vehicle/{id}")
    public List<ServiceOrder> getServiceOrderbyVehicle(@PathVariable Long id) {
        log.debug("REST request to get ServiceOrderByOrderId : {}", id);
        List<Order> orders = orderRepository.findOrderByVehicle_Id(id);
        List<ServiceOrder> allServicesOrders = serviceOrderRepository.findAll();
        List<ServiceOrder> serviceOrders = new ArrayList();
        if (orders.size() > 0) {
            for (Order o : orders) {
                for (ServiceOrder s : allServicesOrders) {
                    if (o.getId() != null && s.getOrder() != null) {
                        if (o.getId() == s.getOrder().getId()) {
                            serviceOrders.add(s);
                        }
                    }
                }
            }
        }

        //Add the 'files' as they are not coming already for some reason
        if (serviceOrders.size() > 0) {
            serviceOrders.forEach(
                so -> {
                    List<File> files = fileRepository.findFilesByServiceOrder_Id(so.getId());
                    files.forEach(
                        file -> {
                            so.addFile(file);
                        }
                    );
                }
            );
        }

        return serviceOrders;
    }

    /**
     * {@code DELETE  /service-orders/:id} : delete the "id" serviceOrder.
     *
     * @param id the id of the serviceOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-orders/{id}")
    public ResponseEntity<Void> deleteServiceOrder(@PathVariable Long id) {
        log.debug("REST request to delete ServiceOrder : {}", id);
        serviceOrderRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(false, ENTITY_NAME, "", id.toString())).build();
    }

    @GetMapping("/service-ordersOrder/{id}")
    public ResponseEntity<ServiceOrder> getServiceOrderByOrder(@PathVariable Long id) {
        log.debug("REST request to get ServiceOrder : {}", id);
        Optional<ServiceOrder> serviceOrder = serviceOrderRepository.findServiceOrderByOrderId(id);
        return ResponseUtil.wrapOrNotFound(serviceOrder);
    }
}
