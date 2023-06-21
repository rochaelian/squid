package com.manati.squid.web.rest;

import com.manati.squid.domain.APP;
import com.manati.squid.domain.Business;
import com.manati.squid.domain.Order;
import com.manati.squid.domain.OrderRating;
import com.manati.squid.repository.APPRepository;
import com.manati.squid.repository.BusinessRepository;
import com.manati.squid.repository.OrderRatingRepository;
import com.manati.squid.repository.OrderRepository;
import com.manati.squid.web.rest.HeaderUtil;
import com.manati.squid.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.OrderRating}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderRatingResource {

    private final Logger log = LoggerFactory.getLogger(OrderRatingResource.class);

    private static final String ENTITY_NAME = "orderRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderRatingRepository orderRatingRepository;

    private final BusinessRepository businessRepository;

    private final OrderRepository orderRepository;

    private final APPRepository appRepository;

    public OrderRatingResource(
        OrderRatingRepository orderRatingRepository,
        BusinessRepository businessRepository,
        OrderRepository orderRepository,
        APPRepository appRepository
    ) {
        this.orderRatingRepository = orderRatingRepository;
        this.businessRepository = businessRepository;
        this.orderRepository = orderRepository;
        this.appRepository = appRepository;
    }

    /**
     * {@code POST  /order-ratings} : Create a new orderRating.
     *
     * @param orderRating the orderRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderRating, or with status {@code 400 (Bad Request)} if the orderRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-ratings")
    public ResponseEntity<OrderRating> createOrderRating(@RequestBody OrderRating orderRating) throws URISyntaxException {
        log.debug("REST request to save OrderRating : {}", orderRating);
        if (orderRating.getId() != null) {
            throw new BadRequestAlertException("Orden ya calificada", ENTITY_NAME, ". No se puede calificar de nuevo.");
        }

        if (orderRating.getRating() == null) {
            orderRating.setRating(5);
        }

        OrderRating result = orderRatingRepository.save(orderRating);
        calculateAverageBusinessRating(result.getOrder().getBusiness().getId(), result.getRating());
        return ResponseEntity
            .created(new URI("/api/order-ratings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(false, ENTITY_NAME, "", result.getId().toString()))
            .body(result);
    }

    public void calculateAverageBusinessRating(Long id, int rating) {
        List<Order> ordenes = orderRepository.findOrdersByBusinessId(id);
        List<OrderRating> ordersRatings = orderRatingRepository.findAll();
        int count = 0;
        int sum = 0;
        double average = 5;

        if (ordenes.size() > 0 && ordersRatings.size() > 0) {
            for (Order o : ordenes) {
                for (OrderRating or : ordersRatings) {
                    if (o.getId() == or.getOrder().getId()) {
                        sum = sum + or.getRating();
                        count++;
                    }
                }
            }
        } else {
            sum = rating;
            count = 1;
        }

        if (count > 0 && sum > 0) {
            average = sum / count;
        } else {
            average = rating;
        }

        Optional<Business> result = businessRepository.findById(id);
        Business business = result.get();
        business.setRating(average);
        businessRepository.save(business);
    }

    /**
     * {@code PUT  /order-ratings/:id} : Updates an existing orderRating.
     *
     * @param id the id of the orderRating to save.
     * @param orderRating the orderRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderRating,
     * or with status {@code 400 (Bad Request)} if the orderRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-ratings/{id}")
    public ResponseEntity<OrderRating> updateOrderRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderRating orderRating
    ) throws URISyntaxException {
        log.debug("REST request to update OrderRating : {}, {}", id, orderRating);
        if (orderRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderRating result = orderRatingRepository.save(orderRating);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", orderRating.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /order-ratings/:id} : Partial updates given fields of an existing orderRating, field will ignore if it is null
     *
     * @param id the id of the orderRating to save.
     * @param orderRating the orderRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderRating,
     * or with status {@code 400 (Bad Request)} if the orderRating is not valid,
     * or with status {@code 404 (Not Found)} if the orderRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/order-ratings/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<OrderRating> partialUpdateOrderRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrderRating orderRating
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderRating partially : {}, {}", id, orderRating);
        if (orderRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderRating> result = orderRatingRepository
            .findById(orderRating.getId())
            .map(
                existingOrderRating -> {
                    if (orderRating.getRating() != null) {
                        existingOrderRating.setRating(orderRating.getRating());
                    }
                    if (orderRating.getComment() != null) {
                        existingOrderRating.setComment(orderRating.getComment());
                    }

                    return existingOrderRating;
                }
            )
            .map(orderRatingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", orderRating.getId().toString())
        );
    }

    /**
     * {@code GET  /order-ratings} : get all the orderRatings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderRatings in body.
     */
    @GetMapping("/order-ratings")
    public List<OrderRating> getAllOrderRatings() {
        log.debug("REST request to get all OrderRatings");
        return orderRatingRepository.findAll();
    }

    /**
     * {@code GET  /order-ratings/:id} : get the "id" orderRating.
     *
     * @param id the id of the orderRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-ratings/{id}")
    public ResponseEntity<OrderRating> getOrderRating(@PathVariable Long id) {
        log.debug("REST request to get OrderRating : {}", id);
        Optional<OrderRating> orderRating = orderRatingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderRating);
    }

    /**
     * {@code DELETE  /order-ratings/:id} : delete the "id" orderRating.
     *
     * @param id the id of the orderRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-ratings/{id}")
    public ResponseEntity<Void> deleteOrderRating(@PathVariable Long id) {
        log.debug("REST request to delete OrderRating : {}", id);
        orderRatingRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(false, ENTITY_NAME, "", id.toString())).build();
    }

    /**
     * {@code GET  /order} : get status of comment and rating.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seoRecords in body.
     */
    @GetMapping("/order-ratings-status/{id}")
    public Boolean getRatingOrder(@PathVariable Long id) {
        log.debug("REST request to get comments and rating status");
        return orderRatingRepository.existsOrderRatingByOrder_Id(id);
    }

    public void validateSEOpayment() {}
}
