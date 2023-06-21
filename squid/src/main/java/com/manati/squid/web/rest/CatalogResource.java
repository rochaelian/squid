package com.manati.squid.web.rest;

import com.manati.squid.domain.Catalog;
import com.manati.squid.repository.CatalogRepository;
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
 * REST controller for managing {@link com.manati.squid.domain.Catalog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CatalogResource {

    private final Logger log = LoggerFactory.getLogger(CatalogResource.class);

    private static final String ENTITY_NAME = "catalog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CatalogRepository catalogRepository;

    public CatalogResource(CatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    /**
     * {@code POST  /catalogs} : Create a new catalog.
     *
     * @param catalog the catalog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new catalog, or with status {@code 400 (Bad Request)} if the catalog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/catalogs")
    public ResponseEntity<Catalog> createCatalog(@RequestBody Catalog catalog) throws URISyntaxException {
        log.debug("REST request to save Catalog : {}", catalog);
        if (catalog.getId() != null) {
            throw new BadRequestAlertException("A new catalog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Catalog result = catalogRepository.save(catalog);
        return ResponseEntity
            .created(new URI("/api/catalogs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(false, ENTITY_NAME, "", result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /catalogs/:id} : Updates an existing catalog.
     *
     * @param id the id of the catalog to save.
     * @param catalog the catalog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated catalog,
     * or with status {@code 400 (Bad Request)} if the catalog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the catalog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/catalogs/{id}")
    public ResponseEntity<Catalog> updateCatalog(@PathVariable(value = "id", required = false) final Long id, @RequestBody Catalog catalog)
        throws URISyntaxException {
        log.debug("REST request to update Catalog : {}, {}", id, catalog);
        if (catalog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, catalog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!catalogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Catalog result = catalogRepository.save(catalog);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", catalog.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /catalogs/:id} : Partial updates given fields of an existing catalog, field will ignore if it is null
     *
     * @param id the id of the catalog to save.
     * @param catalog the catalog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated catalog,
     * or with status {@code 400 (Bad Request)} if the catalog is not valid,
     * or with status {@code 404 (Not Found)} if the catalog is not found,
     * or with status {@code 500 (Internal Server Error)} if the catalog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/catalogs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Catalog> partialUpdateCatalog(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Catalog catalog
    ) throws URISyntaxException {
        log.debug("REST request to partial update Catalog partially : {}, {}", id, catalog);
        if (catalog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, catalog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!catalogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Catalog> result = catalogRepository
            .findById(catalog.getId())
            .map(
                existingCatalog -> {
                    if (catalog.getName() != null) {
                        existingCatalog.setName(catalog.getName());
                    }
                    if (catalog.getType() != null) {
                        existingCatalog.setType(catalog.getType());
                    }
                    if (catalog.getStatus() != null) {
                        existingCatalog.setStatus(catalog.getStatus());
                    }

                    return existingCatalog;
                }
            )
            .map(catalogRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", catalog.getId().toString()));
    }

    /**
     * {@code GET  /catalogs} : get all the catalogs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of catalogs in body.
     */
    @GetMapping("/catalogs")
    public List<Catalog> getAllCatalogs() {
        log.debug("REST request to get all Catalogs");
        return catalogRepository.findAll();
    }

    /**
     * {@code GET  /catalogs/:id} : get the "id" catalog.
     *
     * @param id the id of the catalog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the catalog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/catalogs/{id}")
    public ResponseEntity<Catalog> getCatalog(@PathVariable Long id) {
        log.debug("REST request to get Catalog : {}", id);
        Optional<Catalog> catalog = catalogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(catalog);
    }

    @GetMapping(value = "/catalogs", params = "name")
    public ResponseEntity<Catalog> getCatalogByName(@RequestParam String name) {
        log.debug("REST request to get Catalog by id : {}", name);
        Optional<Catalog> catalog = catalogRepository.findCatalogsByName(name);
        return ResponseUtil.wrapOrNotFound(catalog);
    }

    /**
     * {@code DELETE  /catalogs/:id} : delete the "id" catalog.
     *
     * @param id the id of the catalog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/catalogs/{id}")
    public ResponseEntity<Void> deleteCatalog(@PathVariable Long id) {
        log.debug("REST request to delete Catalog : {}", id);
        catalogRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(false, ENTITY_NAME, "", id.toString())).build();
    }
}
