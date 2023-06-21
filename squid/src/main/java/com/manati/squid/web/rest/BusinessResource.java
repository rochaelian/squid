package com.manati.squid.web.rest;

import com.manati.squid.domain.*;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.BusinessRepository;
import com.manati.squid.repository.BusinessServiceRepository;
import com.manati.squid.repository.CatServiceRepository;
import com.manati.squid.repository.SeoRecordRepository;
import com.manati.squid.service.MailService;
import com.manati.squid.web.rest.errors.BadRequestAlertException;
import java.awt.print.Pageable;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.Business}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BusinessResource {

    private final Logger log = LoggerFactory.getLogger(BusinessResource.class);

    private static final String ENTITY_NAME = "business";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BusinessRepository businessRepository;
    private final CatServiceRepository catServiceRepository;
    private final BusinessServiceRepository businessServiceRepository;
    private final MailService mailService;
    private final SeoRecordRepository seoRecordRepository;

    public BusinessResource(
        BusinessRepository businessRepository,
        CatServiceRepository catServiceRepository,
        MailService mailService,
        BusinessServiceRepository businessServiceRepository,
        SeoRecordRepository seoRecordRepository
    ) {
        this.businessRepository = businessRepository;
        this.catServiceRepository = catServiceRepository;
        this.mailService = mailService;
        this.businessServiceRepository = businessServiceRepository;
        this.seoRecordRepository = seoRecordRepository;
    }

    /**
     * {@code POST  /businesses} : Create a new business.
     *
     * @param business the business to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new business, or with status {@code 400 (Bad Request)} if the business has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/businesses")
    public ResponseEntity<Business> createBusiness(@RequestBody Business business) throws URISyntaxException {
        log.debug("REST request to save Business : {}", business);
        if (business.getId() != null) {
            throw new BadRequestAlertException("A new business cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Business result = businessRepository.save(business);

        return ResponseEntity
            .created(new URI("/api/businesses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /businesses/:id} : Updates an existing business.
     *
     * @param id the id of the business to save.
     * @param business the business to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated business,
     * or with status {@code 400 (Bad Request)} if the business is not valid,
     * or with status {@code 500 (Internal Server Error)} if the business couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/businesses/{id}")
    public ResponseEntity<Business> updateBusiness(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Business business
    ) throws URISyntaxException {
        log.debug("REST request to update Business : {}, {}", id, business);
        if (business.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, business.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (business.getStatus() == Status.Pending) {
            mailService.sendApprovedBusiness(business.getOwner());
            business.setStatus(Status.Enabled);
        }
        if (business.getStatus() == Status.Rejected) {
            mailService.sendBusinessRejected(business.getOwner());
            business.setStatus(Status.Disabled);
        }
        Business result = businessRepository.save(business);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, business.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /businesses/:id} : Partial updates given fields of an existing business, field will ignore if it is null
     *
     * @param id the id of the business to save.
     * @param business the business to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated business,
     * or with status {@code 400 (Bad Request)} if the business is not valid,
     * or with status {@code 404 (Not Found)} if the business is not found,
     * or with status {@code 500 (Internal Server Error)} if the business couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/businesses/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Business> partialUpdateBusiness(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Business business
    ) throws URISyntaxException {
        log.debug("REST request to partial update Business partially : {}, {}", id, business);
        if (business.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, business.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Business> result = businessRepository
            .findById(business.getId())
            .map(
                existingBusiness -> {
                    if (business.getIdentification() != null) {
                        existingBusiness.setIdentification(business.getIdentification());
                    }
                    if (business.getName() != null) {
                        existingBusiness.setName(business.getName());
                    }
                    if (business.getTaxRegime() != null) {
                        existingBusiness.setTaxRegime(business.getTaxRegime());
                    }
                    if (business.getCategory() != null) {
                        existingBusiness.setCategory(business.getCategory());
                    }
                    if (business.getRating() != null) {
                        existingBusiness.setRating(business.getRating());
                    }
                    if (business.getStatus() != null) {
                        existingBusiness.setStatus(business.getStatus());
                    }
                    if (business.getCapacity() != null) {
                        existingBusiness.setCapacity(business.getCapacity());
                    }
                    if (business.getImage() != null) {
                        existingBusiness.setImage(business.getImage());
                    }

                    return existingBusiness;
                }
            )
            .map(businessRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, business.getId().toString())
        );
    }

    /**
     * {@code GET  /businesses} : get all the businesses.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businesses in body.
     */
    @GetMapping("/businesses")
    public List<Business> getAllBusinesses(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Businesses");
        return businessRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /businesses/:id} : get the "id" business.
     *
     * @param id the id of the business to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the business, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/businesses/{id}")
    public ResponseEntity<Business> getBusiness(@PathVariable Long id) {
        log.debug("REST request to get Business : {}", id);
        Optional<Business> business = businessRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(business);
    }

    /**
     * {@code GET  /businesses-highest-rated
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the business, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/businesses-highest-rated")
    public ResponseEntity<Business> getBusinessHighestRated() {
        log.debug("REST request to get Business highest rated");
        List<Business> list = businessRepository.findBusinessTop1();

        Optional<Business> business = Optional.ofNullable(list.get(0));

        return ResponseUtil.wrapOrNotFound(business);
    }

    /**
     * {@code DELETE  /businesses/:id} : delete the "id" business.
     *
     * @param id the id of the business to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/businesses/{id}")
    public ResponseEntity<Void> deleteBusiness(@PathVariable Long id) {
        log.debug("REST request to delete Business : {}", id);
        businessRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /businesses} : get all the businesses by owner.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businesses in body.
     */
    @GetMapping("/businesses-owner/{id}")
    public List<Business> getAllBusinessesByOwner(@PathVariable Long id) {
        log.debug("REST request to get all Businesses by Owner");
        Status businessStatus = Status.Enabled;
        return businessRepository.findByOwner(id, businessStatus);
    }

    /**
     * {@code GET  /businesses} : get all the businesses.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businesses in body.
     */
    @GetMapping("/businesses-enabled")
    public List<Business> getAllEnabledBusinesses(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Businesses with enabled status");
        Status businessStatus = Status.Enabled;
        return applySEOrecord(businessRepository.findAllEnabledBusinesses(businessStatus));
        // List<Business> negociosFiltrados = new ArrayList<Business>();

        /*        for(Business b : negocios){
            Location location = b.getLocation();
            if(location.getDistrict().equals() && b.getStatus().equals(businessStatus)){
                negociosFiltrados.add(b);
            }
        }*/

    }

    @GetMapping("/businesses-taller")
    public List<Business> getAllTallerBusinesses(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Businesses category Taller");
        String businessCategory = "Taller";
        return businessRepository.findAllTallerBusinesses(businessCategory);
    }

    @GetMapping(value = "/businesses-category", params = { "category" })
    public List<Business> getAllBusinessesCategory(@RequestParam("category") String category) {
        log.debug("REST request to get all Businesses");
        Status businessStatus = Status.Enabled;
        List<Business> negocios = businessRepository.findAll();
        List<Business> negociosFiltrados = new ArrayList<Business>();

        for (Business b : negocios) {
            if (b.getCategory().equals(category) && b.getStatus().equals(businessStatus)) {
                negociosFiltrados.add(b);
            }
        }
        return negociosFiltrados;
    }

    @GetMapping(value = "/businesses-province", params = { "province" })
    public List<Business> getAllBusinessesProvince(@RequestParam("province") String province) {
        log.debug("REST request to get all Businesses of a province");
        Status businessStatus = Status.Enabled;
        List<Business> negocios = businessRepository.findAll();
        List<Business> negociosFiltrados = new ArrayList<Business>();

        for (Business b : negocios) {
            Location loc = b.getLocation();
            if (loc.getProvince().equals(province) && b.getStatus().equals(businessStatus)) {
                negociosFiltrados.add(b);
            }
        }
        return negociosFiltrados;
    }

    @GetMapping("/businesses-serv/{id}") // Es el del filtro de los cards
    public List<Business> getAllBusinessesService(@PathVariable Long id) {
        log.debug("REST request to get all the Business by service :", id);
        Status businessStatus = Status.Enabled;
        List<Business> negocios = businessRepository.findAll();
        List<Business> negociosFiltrados = new ArrayList<Business>();

        List<BusinessService> businessServices = businessServiceRepository.findAll();

        for (Business b : negocios) {
            for (BusinessService busS : businessServices) {
                if (b.getId() == busS.getBusiness().getId() && busS.getService().getId() == id && b.getStatus().equals(businessStatus)) {
                    negociosFiltrados.add(b);
                }
            }
        }
        return negociosFiltrados;
    }

    @GetMapping("/businesses-insurances")
    public List<Catalog> getAllBusinessesByAssurance() {
        log.debug("ESTO TRAE TODAS LAS ASEGURADORAS");
        Status businessStatus = Status.Enabled;
        return businessRepository.findAllInsuranceBusinesses();
    }

    public List<Business> applySEOrecord(List<Business> filteredBusinesses) {
        Status enabledStatus = Status.Enabled;
        List<SeoRecord> historial = seoRecordRepository.findAllEnabledSeoRecord(enabledStatus);
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate lt = LocalDate.now();
        int month = localDate.getMonthValue();
        int year = localDate.getYear();
        Boolean findBusiness = false;
        List<Business> businessesSeoRecord = new ArrayList<>();
        if (historial.size() > 0) {
            for (SeoRecord s : historial) {
                if (s.getDate().getMonthValue() == month && s.getDate().getYear() == year) {
                    businessesSeoRecord.add(s.getBusiness());
                }
            }
        }

        List<Business> resultList = new ArrayList<>();

        if (filteredBusinesses.size() > 0 && businessesSeoRecord.size() > 0) {
            for (Business fb : filteredBusinesses) {
                for (Business sb : businessesSeoRecord) {
                    if (fb.getId() == sb.getId()) {
                        resultList.add(fb);
                    }
                }
            }

            for (Business fb : filteredBusinesses) {
                Boolean find = false;
                for (Business rs : resultList) {
                    if (fb.getId() == rs.getId()) {
                        find = true;
                    }
                }
                if (!find) {
                    resultList.add(fb);
                }
            }
        } else {
            resultList = filteredBusinesses;
        }

        return resultList;
    }
}
