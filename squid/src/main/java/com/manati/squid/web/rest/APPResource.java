package com.manati.squid.web.rest;

import com.manati.squid.domain.APP;
import com.manati.squid.repository.APPRepository;
import com.manati.squid.web.rest.HeaderUtil;
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
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.APP}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class APPResource {

    private final Logger log = LoggerFactory.getLogger(APPResource.class);

    private static final String ENTITY_NAME = "aPP";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final APPRepository aPPRepository;

    public APPResource(APPRepository aPPRepository) {
        this.aPPRepository = aPPRepository;
    }

    /**
     * {@code POST  /apps} : Create a new aPP.
     *
     * @param aPP the aPP to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new aPP, or with status {@code 400 (Bad Request)} if the aPP has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/apps")
    public ResponseEntity<APP> createAPP(@RequestBody APP aPP) throws URISyntaxException {
        log.debug("REST request to save APP : {}", aPP);
        if (aPP.getId() != null) {
            throw new BadRequestAlertException("A new aPP cannot already have an ID", ENTITY_NAME, "idexists");
        }
        APP result = aPPRepository.save(aPP);
        return ResponseEntity
            .created(new URI("/api/apps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(false, ENTITY_NAME, "", result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /apps/:id} : Updates an existing aPP.
     *
     * @param id the id of the aPP to save.
     * @param aPP the aPP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aPP,
     * or with status {@code 400 (Bad Request)} if the aPP is not valid,
     * or with status {@code 500 (Internal Server Error)} if the aPP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/apps/{id}")
    public ResponseEntity<APP> updateAPP(@PathVariable(value = "id", required = false) final Long id, @RequestBody APP aPP)
        throws URISyntaxException {
        log.debug("REST request to update APP : {}, {}", id, aPP);
        if (aPP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aPP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aPPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        APP result = aPPRepository.save(aPP);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", aPP.getId().toString())).body(result);
    }

    /**
     * {@code PATCH  /apps/:id} : Partial updates given fields of an existing aPP, field will ignore if it is null
     *
     * @param id the id of the aPP to save.
     * @param aPP the aPP to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aPP,
     * or with status {@code 400 (Bad Request)} if the aPP is not valid,
     * or with status {@code 404 (Not Found)} if the aPP is not found,
     * or with status {@code 500 (Internal Server Error)} if the aPP couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/apps/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<APP> partialUpdateAPP(@PathVariable(value = "id", required = false) final Long id, @RequestBody APP aPP)
        throws URISyntaxException {
        log.debug("REST request to partial update APP partially : {}, {}", id, aPP);
        if (aPP.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aPP.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aPPRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<APP> result = aPPRepository
            .findById(aPP.getId())
            .map(
                existingAPP -> {
                    if (aPP.getType() != null) {
                        existingAPP.setType(aPP.getType());
                    }
                    if (aPP.getIncome() != null) {
                        existingAPP.setIncome(aPP.getIncome());
                    }
                    if (aPP.getComission() != null) {
                        existingAPP.setComission(aPP.getComission());
                    }
                    if (aPP.getsEOCost() != null) {
                        existingAPP.setsEOCost(aPP.getsEOCost());
                    }

                    return existingAPP;
                }
            )
            .map(aPPRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", aPP.getId().toString()));
    }

    /**
     * {@code GET  /apps} : get all the aPPS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of aPPS in body.
     */
    @GetMapping("/apps")
    public List<APP> getAllAPPS() {
        log.debug("REST request to get all APPS");
        return aPPRepository.findAll();
    }

    /**
     * {@code GET  /apps/:id} : get the "id" aPP.
     *
     * @param id the id of the aPP to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the aPP, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/apps/{id}")
    public ResponseEntity<APP> getAPP(@PathVariable Long id) {
        log.debug("REST request to get APP : {}", id);
        Optional<APP> aPP = aPPRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(aPP);
    }

    /**
     * {@code DELETE  /apps/:id} : delete the "id" aPP.
     *
     * @param id the id of the aPP to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/apps/{id}")
    public ResponseEntity<Void> deleteAPP(@PathVariable Long id) {
        log.debug("REST request to delete APP : {}", id);
        aPPRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(false, ENTITY_NAME, "", id.toString())).build();
    }
}
