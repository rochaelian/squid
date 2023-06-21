package com.manati.squid.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.manati.squid.IntegrationTest;
import com.manati.squid.domain.CatService;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.CatServiceRepository;
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
 * Integration tests for the {@link CatServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CatServiceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.Pending;
    private static final Status UPDATED_STATUS = Status.Enabled;

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/cat-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CatServiceRepository catServiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCatServiceMockMvc;

    private CatService catService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CatService createEntity(EntityManager em) {
        CatService catService = new CatService().name(DEFAULT_NAME).status(DEFAULT_STATUS).category(DEFAULT_CATEGORY);
        return catService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CatService createUpdatedEntity(EntityManager em) {
        CatService catService = new CatService().name(UPDATED_NAME).status(UPDATED_STATUS).category(UPDATED_CATEGORY);
        return catService;
    }

    @BeforeEach
    public void initTest() {
        catService = createEntity(em);
    }

    @Test
    @Transactional
    void createCatService() throws Exception {
        int databaseSizeBeforeCreate = catServiceRepository.findAll().size();
        // Create the CatService
        restCatServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catService)))
            .andExpect(status().isCreated());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeCreate + 1);
        CatService testCatService = catServiceList.get(catServiceList.size() - 1);
        assertThat(testCatService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCatService.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testCatService.getCategory()).isEqualTo(DEFAULT_CATEGORY);
    }

    @Test
    @Transactional
    void createCatServiceWithExistingId() throws Exception {
        // Create the CatService with an existing ID
        catService.setId(1L);

        int databaseSizeBeforeCreate = catServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCatServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catService)))
            .andExpect(status().isBadRequest());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCatServices() throws Exception {
        // Initialize the database
        catServiceRepository.saveAndFlush(catService);

        // Get all the catServiceList
        restCatServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(catService.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)));
    }

    @Test
    @Transactional
    void getCatService() throws Exception {
        // Initialize the database
        catServiceRepository.saveAndFlush(catService);

        // Get the catService
        restCatServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, catService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(catService.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY));
    }

    @Test
    @Transactional
    void getNonExistingCatService() throws Exception {
        // Get the catService
        restCatServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCatService() throws Exception {
        // Initialize the database
        catServiceRepository.saveAndFlush(catService);

        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();

        // Update the catService
        CatService updatedCatService = catServiceRepository.findById(catService.getId()).get();
        // Disconnect from session so that the updates on updatedCatService are not directly saved in db
        em.detach(updatedCatService);
        updatedCatService.name(UPDATED_NAME).status(UPDATED_STATUS).category(UPDATED_CATEGORY);

        restCatServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCatService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCatService))
            )
            .andExpect(status().isOk());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
        CatService testCatService = catServiceList.get(catServiceList.size() - 1);
        assertThat(testCatService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCatService.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCatService.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    @Transactional
    void putNonExistingCatService() throws Exception {
        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();
        catService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCatServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, catService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(catService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCatService() throws Exception {
        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();
        catService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(catService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCatService() throws Exception {
        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();
        catService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatServiceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(catService)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCatServiceWithPatch() throws Exception {
        // Initialize the database
        catServiceRepository.saveAndFlush(catService);

        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();

        // Update the catService using partial update
        CatService partialUpdatedCatService = new CatService();
        partialUpdatedCatService.setId(catService.getId());

        partialUpdatedCatService.status(UPDATED_STATUS).category(UPDATED_CATEGORY);

        restCatServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCatService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCatService))
            )
            .andExpect(status().isOk());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
        CatService testCatService = catServiceList.get(catServiceList.size() - 1);
        assertThat(testCatService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCatService.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCatService.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    @Transactional
    void fullUpdateCatServiceWithPatch() throws Exception {
        // Initialize the database
        catServiceRepository.saveAndFlush(catService);

        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();

        // Update the catService using partial update
        CatService partialUpdatedCatService = new CatService();
        partialUpdatedCatService.setId(catService.getId());

        partialUpdatedCatService.name(UPDATED_NAME).status(UPDATED_STATUS).category(UPDATED_CATEGORY);

        restCatServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCatService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCatService))
            )
            .andExpect(status().isOk());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
        CatService testCatService = catServiceList.get(catServiceList.size() - 1);
        assertThat(testCatService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCatService.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testCatService.getCategory()).isEqualTo(UPDATED_CATEGORY);
    }

    @Test
    @Transactional
    void patchNonExistingCatService() throws Exception {
        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();
        catService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCatServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, catService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(catService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCatService() throws Exception {
        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();
        catService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(catService))
            )
            .andExpect(status().isBadRequest());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCatService() throws Exception {
        int databaseSizeBeforeUpdate = catServiceRepository.findAll().size();
        catService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCatServiceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(catService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CatService in the database
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCatService() throws Exception {
        // Initialize the database
        catServiceRepository.saveAndFlush(catService);

        int databaseSizeBeforeDelete = catServiceRepository.findAll().size();

        // Delete the catService
        restCatServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, catService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CatService> catServiceList = catServiceRepository.findAll();
        assertThat(catServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
