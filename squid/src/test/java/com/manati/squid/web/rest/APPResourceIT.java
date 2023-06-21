package com.manati.squid.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.manati.squid.IntegrationTest;
import com.manati.squid.domain.APP;
import com.manati.squid.repository.APPRepository;
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
 * Integration tests for the {@link APPResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class APPResourceIT {

    private static final Integer DEFAULT_TYPE = 1;
    private static final Integer UPDATED_TYPE = 2;

    private static final Double DEFAULT_INCOME = 1D;
    private static final Double UPDATED_INCOME = 2D;

    private static final Double DEFAULT_COMISSION = 1D;
    private static final Double UPDATED_COMISSION = 2D;

    private static final Double DEFAULT_S_EO_COST = 1D;
    private static final Double UPDATED_S_EO_COST = 2D;

    private static final String ENTITY_API_URL = "/api/apps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private APPRepository aPPRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAPPMockMvc;

    private APP aPP;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static APP createEntity(EntityManager em) {
        APP aPP = new APP().type(DEFAULT_TYPE).income(DEFAULT_INCOME).comission(DEFAULT_COMISSION).sEOCost(DEFAULT_S_EO_COST);
        return aPP;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static APP createUpdatedEntity(EntityManager em) {
        APP aPP = new APP().type(UPDATED_TYPE).income(UPDATED_INCOME).comission(UPDATED_COMISSION).sEOCost(UPDATED_S_EO_COST);
        return aPP;
    }

    @BeforeEach
    public void initTest() {
        aPP = createEntity(em);
    }

    @Test
    @Transactional
    void createAPP() throws Exception {
        int databaseSizeBeforeCreate = aPPRepository.findAll().size();
        // Create the APP
        restAPPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aPP)))
            .andExpect(status().isCreated());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeCreate + 1);
        APP testAPP = aPPList.get(aPPList.size() - 1);
        assertThat(testAPP.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAPP.getIncome()).isEqualTo(DEFAULT_INCOME);
        assertThat(testAPP.getComission()).isEqualTo(DEFAULT_COMISSION);
        assertThat(testAPP.getsEOCost()).isEqualTo(DEFAULT_S_EO_COST);
    }

    @Test
    @Transactional
    void createAPPWithExistingId() throws Exception {
        // Create the APP with an existing ID
        aPP.setId(1L);

        int databaseSizeBeforeCreate = aPPRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAPPMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aPP)))
            .andExpect(status().isBadRequest());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAPPS() throws Exception {
        // Initialize the database
        aPPRepository.saveAndFlush(aPP);

        // Get all the aPPList
        restAPPMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(aPP.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].income").value(hasItem(DEFAULT_INCOME.doubleValue())))
            .andExpect(jsonPath("$.[*].comission").value(hasItem(DEFAULT_COMISSION.doubleValue())))
            .andExpect(jsonPath("$.[*].sEOCost").value(hasItem(DEFAULT_S_EO_COST.doubleValue())));
    }

    @Test
    @Transactional
    void getAPP() throws Exception {
        // Initialize the database
        aPPRepository.saveAndFlush(aPP);

        // Get the aPP
        restAPPMockMvc
            .perform(get(ENTITY_API_URL_ID, aPP.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(aPP.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.income").value(DEFAULT_INCOME.doubleValue()))
            .andExpect(jsonPath("$.comission").value(DEFAULT_COMISSION.doubleValue()))
            .andExpect(jsonPath("$.sEOCost").value(DEFAULT_S_EO_COST.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingAPP() throws Exception {
        // Get the aPP
        restAPPMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAPP() throws Exception {
        // Initialize the database
        aPPRepository.saveAndFlush(aPP);

        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();

        // Update the aPP
        APP updatedAPP = aPPRepository.findById(aPP.getId()).get();
        // Disconnect from session so that the updates on updatedAPP are not directly saved in db
        em.detach(updatedAPP);
        updatedAPP.type(UPDATED_TYPE).income(UPDATED_INCOME).comission(UPDATED_COMISSION).sEOCost(UPDATED_S_EO_COST);

        restAPPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAPP.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAPP))
            )
            .andExpect(status().isOk());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
        APP testAPP = aPPList.get(aPPList.size() - 1);
        assertThat(testAPP.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAPP.getIncome()).isEqualTo(UPDATED_INCOME);
        assertThat(testAPP.getComission()).isEqualTo(UPDATED_COMISSION);
        assertThat(testAPP.getsEOCost()).isEqualTo(UPDATED_S_EO_COST);
    }

    @Test
    @Transactional
    void putNonExistingAPP() throws Exception {
        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();
        aPP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAPPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, aPP.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aPP))
            )
            .andExpect(status().isBadRequest());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAPP() throws Exception {
        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();
        aPP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAPPMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(aPP))
            )
            .andExpect(status().isBadRequest());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAPP() throws Exception {
        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();
        aPP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAPPMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aPP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAPPWithPatch() throws Exception {
        // Initialize the database
        aPPRepository.saveAndFlush(aPP);

        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();

        // Update the aPP using partial update
        APP partialUpdatedAPP = new APP();
        partialUpdatedAPP.setId(aPP.getId());

        partialUpdatedAPP.income(UPDATED_INCOME).comission(UPDATED_COMISSION);

        restAPPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAPP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAPP))
            )
            .andExpect(status().isOk());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
        APP testAPP = aPPList.get(aPPList.size() - 1);
        assertThat(testAPP.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAPP.getIncome()).isEqualTo(UPDATED_INCOME);
        assertThat(testAPP.getComission()).isEqualTo(UPDATED_COMISSION);
        assertThat(testAPP.getsEOCost()).isEqualTo(DEFAULT_S_EO_COST);
    }

    @Test
    @Transactional
    void fullUpdateAPPWithPatch() throws Exception {
        // Initialize the database
        aPPRepository.saveAndFlush(aPP);

        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();

        // Update the aPP using partial update
        APP partialUpdatedAPP = new APP();
        partialUpdatedAPP.setId(aPP.getId());

        partialUpdatedAPP.type(UPDATED_TYPE).income(UPDATED_INCOME).comission(UPDATED_COMISSION).sEOCost(UPDATED_S_EO_COST);

        restAPPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAPP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAPP))
            )
            .andExpect(status().isOk());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
        APP testAPP = aPPList.get(aPPList.size() - 1);
        assertThat(testAPP.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAPP.getIncome()).isEqualTo(UPDATED_INCOME);
        assertThat(testAPP.getComission()).isEqualTo(UPDATED_COMISSION);
        assertThat(testAPP.getsEOCost()).isEqualTo(UPDATED_S_EO_COST);
    }

    @Test
    @Transactional
    void patchNonExistingAPP() throws Exception {
        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();
        aPP.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAPPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, aPP.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aPP))
            )
            .andExpect(status().isBadRequest());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAPP() throws Exception {
        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();
        aPP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAPPMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aPP))
            )
            .andExpect(status().isBadRequest());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAPP() throws Exception {
        int databaseSizeBeforeUpdate = aPPRepository.findAll().size();
        aPP.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAPPMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(aPP)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the APP in the database
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAPP() throws Exception {
        // Initialize the database
        aPPRepository.saveAndFlush(aPP);

        int databaseSizeBeforeDelete = aPPRepository.findAll().size();

        // Delete the aPP
        restAPPMockMvc.perform(delete(ENTITY_API_URL_ID, aPP.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<APP> aPPList = aPPRepository.findAll();
        assertThat(aPPList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
