package com.manati.squid.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.manati.squid.IntegrationTest;
import com.manati.squid.domain.BusinessService;
import com.manati.squid.repository.BusinessServiceRepository;
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
 * Integration tests for the {@link BusinessServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BusinessServiceResourceIT {

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final String ENTITY_API_URL = "/api/business-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BusinessServiceRepository businessServiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBusinessServiceMockMvc;

    private BusinessService businessService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessService createEntity(EntityManager em) {
        BusinessService businessService = new BusinessService().price(DEFAULT_PRICE).duration(DEFAULT_DURATION);
        return businessService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessService createUpdatedEntity(EntityManager em) {
        BusinessService businessService = new BusinessService().price(UPDATED_PRICE).duration(UPDATED_DURATION);
        return businessService;
    }

    @BeforeEach
    public void initTest() {
        businessService = createEntity(em);
    }

    @Test
    @Transactional
    void createBusinessService() throws Exception {
        int databaseSizeBeforeCreate = businessServiceRepository.findAll().size();
        // Create the BusinessService
        restBusinessServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isCreated());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeCreate + 1);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testBusinessService.getDuration()).isEqualTo(DEFAULT_DURATION);
    }

    @Test
    @Transactional
    void createBusinessServiceWithExistingId() throws Exception {
        // Create the BusinessService with an existing ID
        businessService.setId(1L);

        int databaseSizeBeforeCreate = businessServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusinessServiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBusinessServices() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        // Get all the businessServiceList
        restBusinessServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(businessService.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)));
    }

    @Test
    @Transactional
    void getBusinessService() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        // Get the businessService
        restBusinessServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, businessService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(businessService.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION));
    }

    @Test
    @Transactional
    void getNonExistingBusinessService() throws Exception {
        // Get the businessService
        restBusinessServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBusinessService() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();

        // Update the businessService
        BusinessService updatedBusinessService = businessServiceRepository.findById(businessService.getId()).get();
        // Disconnect from session so that the updates on updatedBusinessService are not directly saved in db
        em.detach(updatedBusinessService);
        updatedBusinessService.price(UPDATED_PRICE).duration(UPDATED_DURATION);

        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBusinessService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBusinessService))
            )
            .andExpect(status().isOk());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testBusinessService.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void putNonExistingBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, businessService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBusinessServiceWithPatch() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();

        // Update the businessService using partial update
        BusinessService partialUpdatedBusinessService = new BusinessService();
        partialUpdatedBusinessService.setId(businessService.getId());

        partialUpdatedBusinessService.duration(UPDATED_DURATION);

        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessService))
            )
            .andExpect(status().isOk());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testBusinessService.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void fullUpdateBusinessServiceWithPatch() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();

        // Update the businessService using partial update
        BusinessService partialUpdatedBusinessService = new BusinessService();
        partialUpdatedBusinessService.setId(businessService.getId());

        partialUpdatedBusinessService.price(UPDATED_PRICE).duration(UPDATED_DURATION);

        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessService))
            )
            .andExpect(status().isOk());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
        BusinessService testBusinessService = businessServiceList.get(businessServiceList.size() - 1);
        assertThat(testBusinessService.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testBusinessService.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void patchNonExistingBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, businessService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBusinessService() throws Exception {
        int databaseSizeBeforeUpdate = businessServiceRepository.findAll().size();
        businessService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessServiceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessService in the database
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBusinessService() throws Exception {
        // Initialize the database
        businessServiceRepository.saveAndFlush(businessService);

        int databaseSizeBeforeDelete = businessServiceRepository.findAll().size();

        // Delete the businessService
        restBusinessServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, businessService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BusinessService> businessServiceList = businessServiceRepository.findAll();
        assertThat(businessServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
