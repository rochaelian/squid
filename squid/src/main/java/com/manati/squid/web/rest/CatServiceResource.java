package com.manati.squid.web.rest;

import com.manati.squid.domain.CatService;
import com.manati.squid.repository.CatServiceRepository;
import com.manati.squid.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.CatService}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CatServiceResource {

    private final Logger log = LoggerFactory.getLogger(CatServiceResource.class);

    private static final String ENTITY_NAME = "catService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CatServiceRepository catServiceRepository;

    public CatServiceResource(CatServiceRepository catServiceRepository) {
        this.catServiceRepository = catServiceRepository;
    }

    /**
     * {@code POST  /cat-services} : Create a new catService.
     *
     * @param catService the catService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new catService, or with status {@code 400 (Bad Request)} if the catService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cat-services")
    public ResponseEntity<CatService> createCatService(@RequestBody CatService catService) throws URISyntaxException {
        log.debug("REST request to save CatService : {}", catService);
        if (catService.getId() != null) {
            throw new BadRequestAlertException("A new catService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CatService result = catServiceRepository.save(catService);
        return ResponseEntity
            .created(new URI("/api/cat-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cat-services/:id} : Updates an existing catService.
     *
     * @param id the id of the catService to save.
     * @param catService the catService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated catService,
     * or with status {@code 400 (Bad Request)} if the catService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the catService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cat-services/{id}")
    public ResponseEntity<CatService> updateCatService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CatService catService
    ) throws URISyntaxException {
        log.debug("REST request to update CatService : {}, {}", id, catService);
        if (catService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, catService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!catServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CatService result = catServiceRepository.save(catService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, catService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cat-services/:id} : Partial updates given fields of an existing catService, field will ignore if it is null
     *
     * @param id the id of the catService to save.
     * @param catService the catService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated catService,
     * or with status {@code 400 (Bad Request)} if the catService is not valid,
     * or with status {@code 404 (Not Found)} if the catService is not found,
     * or with status {@code 500 (Internal Server Error)} if the catService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cat-services/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CatService> partialUpdateCatService(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CatService catService
    ) throws URISyntaxException {
        log.debug("REST request to partial update CatService partially : {}, {}", id, catService);
        if (catService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, catService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!catServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CatService> result = catServiceRepository
            .findById(catService.getId())
            .map(
                existingCatService -> {
                    if (catService.getName() != null) {
                        existingCatService.setName(catService.getName());
                    }
                    if (catService.getStatus() != null) {
                        existingCatService.setStatus(catService.getStatus());
                    }
                    if (catService.getCategory() != null) {
                        existingCatService.setCategory(catService.getCategory());
                    }

                    return existingCatService;
                }
            )
            .map(catServiceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, catService.getId().toString())
        );
    }

    /**
     * {@code GET  /cat-services} : get all the catServices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of catServices in body.
     */
    @GetMapping("/cat-services")
    public List<CatService> getAllCatServices() {
        log.debug("REST request to get all CatServices");
        return catServiceRepository.findAll();
    }

    /**
     * {@code GET  /cat-services/:id} : get the "id" catService.
     *
     * @param id the id of the catService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the catService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cat-services/{id}")
    public ResponseEntity<CatService> getCatService(@PathVariable Long id) {
        log.debug("REST request to get CatService : {}", id);
        Optional<CatService> catService = catServiceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(catService);
    }

    /**
     * {@code DELETE  /cat-services/:id} : delete the "id" catService.
     *
     * @param id the id of the catService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cat-services/{id}")
    public ResponseEntity<Void> deleteCatService(@PathVariable Long id) {
        log.debug("REST request to delete CatService : {}", id);
        catServiceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
