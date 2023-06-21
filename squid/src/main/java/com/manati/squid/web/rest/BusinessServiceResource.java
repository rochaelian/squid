package com.manati.squid.web.rest;

import com.manati.squid.domain.*;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.BusinessRepository;
import com.manati.squid.repository.BusinessServiceRepository;
import com.manati.squid.repository.CatServiceRepository;
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
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.BusinessService}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BusinessServiceResource {

    private final Logger log = LoggerFactory.getLogger(BusinessServiceResource.class);

    private static final String ENTITY_NAME = "businessService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BusinessServiceRepository businessServiceRepository;
    private final BusinessRepository businessRepository;
    private final CatServiceRepository catServiceRepository;

    public BusinessServiceResource(
        BusinessServiceRepository businessServiceRepository,
        BusinessRepository businessRepository,
        CatServiceRepository catServiceRepository
    ) {
        this.businessServiceRepository = businessServiceRepository;
        this.businessRepository = businessRepository;
        this.catServiceRepository = catServiceRepository;
    }

    /**
     * {@code POST  /business-services} : Create a new businessService.
     *
     * @param businessService the businessService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new businessService, or with status {@code 400 (Bad Request)} if the businessService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/business-services")
    public ResponseEntity<BusinessService> createBusinessService(@RequestBody BusinessService businessService) throws URISyntaxException {
        log.debug("REST request to save BusinessService : {}", businessService);
        if (businessService.getId() != null) {
            throw new BadRequestAlertException("A new businessService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BusinessService result = businessServiceRepository.save(businessService);
        return ResponseEntity
            .created(new URI("/api/business-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(false, ENTITY_NAME, "", result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /business-services/:id} : Updates an existing businessService.
     *
     * @param id              the id of the businessService to save.
     * @param businessService the businessService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessService,
     * or with status {@code 400 (Bad Request)} if the businessService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the businessService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/business-services/{id}")
    public ResponseEntity<BusinessService> updateBusinessService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BusinessService businessService
    ) throws URISyntaxException {
        log.debug("REST request to update BusinessService : {}, {}", id, businessService);
        if (businessService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BusinessService result = businessServiceRepository.save(businessService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", businessService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /business-services/:id} : Partial updates given fields of an existing businessService, field will ignore if it is null
     *
     * @param id              the id of the businessService to save.
     * @param businessService the businessService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessService,
     * or with status {@code 400 (Bad Request)} if the businessService is not valid,
     * or with status {@code 404 (Not Found)} if the businessService is not found,
     * or with status {@code 500 (Internal Server Error)} if the businessService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/business-services/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<BusinessService> partialUpdateBusinessService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BusinessService businessService
    ) throws URISyntaxException {
        log.debug("REST request to partial update BusinessService partially : {}, {}", id, businessService);
        if (businessService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BusinessService> result = businessServiceRepository
            .findById(businessService.getId())
            .map(
                existingBusinessService -> {
                    if (businessService.getPrice() != null) {
                        existingBusinessService.setPrice(businessService.getPrice());
                    }
                    if (businessService.getDuration() != null) {
                        existingBusinessService.setDuration(businessService.getDuration());
                    }

                    return existingBusinessService;
                }
            )
            .map(businessServiceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", businessService.getId().toString())
        );
    }

    /**
     * {@code GET  /business-services} : get all the businessServices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businessServices in body.
     */
    @GetMapping("/business-services")
    public List<BusinessService> getAllBusinessServices() {
        log.debug("REST request to get all BusinessServices");
        return businessServiceRepository.findAll();
    }

    /**
     * {@code GET  /business-services/:id} : get the "id" businessService.
     *
     * @param id the id of the businessService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the businessService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/business-services/{id}")
    public ResponseEntity<BusinessService> getBusinessService(@PathVariable Long id) {
        log.debug("REST request to get BusinessService : {}", id);
        Optional<BusinessService> businessService = businessServiceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(businessService);
    }

    // Trae sólo los cat-services, es decir, los nombres de los servicios nada más. Precios y otros atributos
    // están en la función de abajo de esta.
    @GetMapping("/businesses-serv-bus/{id}")
    public List<CatService> getAllBusinessesServiceBusiness(@PathVariable Long id) {
        log.debug("REST request to get all service business of a business");

        // Status serviceBusinessStatus = Status.Enabled;
        List<BusinessService> bservices = businessServiceRepository.findAll();
        List<CatService> serviciosFiltrados = new ArrayList<CatService>();

        for (BusinessService bs : bservices) {
            if (bs.getBusiness().getId() == id) serviciosFiltrados.add(bs.getService());
        }
        return serviciosFiltrados;
    }

    @GetMapping("/businesses-serv-business/{id}")
    public List<BusinessService> getAllBusinessesServiceBusAll(@PathVariable Long id) {
        log.debug("REST request to get all business_services (datatable) of a business");

        // Status serviceBusinessStatus = Status.Enabled;
        List<BusinessService> bservices = businessServiceRepository.findAll();
        List<BusinessService> serviciosFiltrados = new ArrayList<BusinessService>();

        for (BusinessService bs : bservices) {
            if (bs.getBusiness().getId() == id) serviciosFiltrados.add(bs);
        }
        return serviciosFiltrados;
    }

    /**
     * {@code GET  /business-services-by-business/:id} : get the "id" businessService.
     *
     * @param id the id of the businessService to retrieve the BusinessServices from.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the businessService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/business-services-by-business/{id}")
    public List<BusinessService> getBusinessServicesByBusiness(@PathVariable Long id) {
        log.debug("REST request to getBusinessServicesByBusiness : {}", id);
        List<BusinessService> businessServices = businessServiceRepository.findBusinessServicesByBusiness_Id(id);
        return businessServices;
    }

    /**
     * {@code DELETE  /business-services/:id} : delete the "id" businessService.
     *
     * @param id the id of the businessService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/business-services/{id}")
    public ResponseEntity<Void> deleteBusinessService(@PathVariable Long id) {
        log.debug("REST request to delete BusinessService : {}", id);
        businessServiceRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(false, ENTITY_NAME, "", id.toString())).build();
    }

    @GetMapping("/business-servicesServ/{id}")
    public List<BusinessService> getAllBusinessesServiceInsurance(@PathVariable Long id) {
        log.debug("REST request to get all the Business by service :", id);
        List<BusinessService> businessServices = businessServiceRepository.findAllByServiceId(id);
        return businessServices;
    }
}
