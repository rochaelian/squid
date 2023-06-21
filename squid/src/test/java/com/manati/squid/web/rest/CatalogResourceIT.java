package com.manati.squid.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.manati.squid.IntegrationTest;
import com.manati.squid.domain.Catalog;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.CatalogRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CatalogResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CatalogResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.Pending;
    private static final Status UPDATED_STATUS = Status.Enabled;

    private static final String ENTITY_API_URL = "/api/catalogs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CatalogRepository catalogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCatalogMockMvc;

    private Catalog catalog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Catalog createEntity(EntityManager em) {
        Catalog catalog = new Catalog().name(DEFAULT_NAME).type(DEFAULT_TYPE).status(DEFAULT_STATUS);
        return catalog;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Catalog createUpdatedEntity(EntityManager em) {
        Catalog catalog = new Catalog().name(UPDATED_NAME).type(UPDATED_TYPE).status(UPDATED_STATUS);
        return catalog;
    }

    @BeforeEach
    public void initTest() {
        catalog = createEntity(em);
    }

    @Test
    @Transactional
    void createCatalog() throws Exception {
        int databaseSizeBeforeCreate = catalogRepository.findAll().size();
        // Create the Catalog
        restCatalogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catalog)))
            .andExpect(status().isCreated());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeCreate + 1);
        Catalog testCatalog = catalogList.get(catalogList.size() - 1);
        assertThat(testCatalog.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCatalog.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCatalog.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createCatalogWithExistingId() throws Exception {
        // Create the Catalog with an existing ID
        catalog.setId(1L);

        int databaseSizeBeforeCreate = catalogRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCatalogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catalog)))
            .andExpect(status().isBadRequest());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCatalogs() throws Exception {
        // Initialize the database
        catalogRepository.saveAndFlush(catalog);

        // Get all the catalogList
        restCatalogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(catalog.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getCatalog() throws Exception {
        // Initialize the database
        catalogRepository.saveAndFlush(catalog);

        // Get the catalog
        restCatalogMockMvc
            .perform(get(ENTITY_API_URL_ID, catalog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(catalog.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCatalog() throws Exception {
        // Get the catalog
        restCatalogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCatalog() throws Exception {
        // Initialize the database
        catalogRepository.saveAndFlush(catalog);

        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();

        // Update the catalog
        Catalog updatedCatalog = catalogRepository.findById(catalog.getId()).get();
        // Disconnect from session so that the updates on updatedCatalog are not directly saved in db
        em.detach(updatedCatalog);
        updatedCatalog.name(UPDATED_NAME).type(UPDATED_TYPE).status(UPDATED_STATUS);

        restCatalogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCatalog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCatalog))
            )
            .andExpect(status().isOk());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
        Catalog testCatalog = catalogList.get(catalogList.size() - 1);
        assertThat(testCatalog.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCatalog.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCatalog.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingCatalog() throws Exception {
        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();
        catalog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCatalogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, catalog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(catalog))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCatalog() throws Exception {
        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();
        catalog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatalogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(catalog))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCatalog() throws Exception {
        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();
        catalog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatalogMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catalog)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCatalogWithPatch() throws Exception {
        // Initialize the database
        catalogRepository.saveAndFlush(catalog);

        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();

        // Update the catalog using partial update
        Catalog partialUpdatedCatalog = new Catalog();
        partialUpdatedCatalog.setId(catalog.getId());

        partialUpdatedCatalog.status(UPDATED_STATUS);

        restCatalogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCatalog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCatalog))
            )
            .andExpect(status().isOk());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
        Catalog testCatalog = catalogList.get(catalogList.size() - 1);
        assertThat(testCatalog.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCatalog.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCatalog.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateCatalogWithPatch() throws Exception {
        // Initialize the database
        catalogRepository.saveAndFlush(catalog);

        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();

        // Update the catalog using partial update
        Catalog partialUpdatedCatalog = new Catalog();
        partialUpdatedCatalog.setId(catalog.getId());

        partialUpdatedCatalog.name(UPDATED_NAME).type(UPDATED_TYPE).status(UPDATED_STATUS);

        restCatalogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCatalog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCatalog))
            )
            .andExpect(status().isOk());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
        Catalog testCatalog = catalogList.get(catalogList.size() - 1);
        assertThat(testCatalog.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCatalog.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCatalog.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingCatalog() throws Exception {
        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();
        catalog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCatalogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, catalog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(catalog))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCatalog() throws Exception {
        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();
        catalog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatalogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(catalog))
            )
            .andExpect(status().isBadRequest());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCatalog() throws Exception {
        int databaseSizeBeforeUpdate = catalogRepository.findAll().size();
        catalog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatalogMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(catalog)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Catalog in the database
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCatalog() throws Exception {
        // Initialize the database
        catalogRepository.saveAndFlush(catalog);

        int databaseSizeBeforeDelete = catalogRepository.findAll().size();

        // Delete the catalog
        restCatalogMockMvc
            .perform(delete(ENTITY_API_URL_ID, catalog.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Catalog> catalogList = catalogRepository.findAll();
        assertThat(catalogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
