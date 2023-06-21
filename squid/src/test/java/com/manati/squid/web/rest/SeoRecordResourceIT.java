package com.manati.squid.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.manati.squid.IntegrationTest;
import com.manati.squid.domain.SeoRecord;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.SeoRecordRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link SeoRecordResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SeoRecordResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_COST = 1D;
    private static final Double UPDATED_COST = 2D;

    private static final Status DEFAULT_STATUS = Status.Pending;
    private static final Status UPDATED_STATUS = Status.Enabled;

    private static final String ENTITY_API_URL = "/api/seo-records";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SeoRecordRepository seoRecordRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSeoRecordMockMvc;

    private SeoRecord seoRecord;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SeoRecord createEntity(EntityManager em) {
        SeoRecord seoRecord = new SeoRecord().date(DEFAULT_DATE).cost(DEFAULT_COST).status(DEFAULT_STATUS);
        return seoRecord;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SeoRecord createUpdatedEntity(EntityManager em) {
        SeoRecord seoRecord = new SeoRecord().date(UPDATED_DATE).cost(UPDATED_COST).status(UPDATED_STATUS);
        return seoRecord;
    }

    @BeforeEach
    public void initTest() {
        seoRecord = createEntity(em);
    }

    @Test
    @Transactional
    void createSeoRecord() throws Exception {
        int databaseSizeBeforeCreate = seoRecordRepository.findAll().size();
        // Create the SeoRecord
        restSeoRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seoRecord)))
            .andExpect(status().isCreated());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeCreate + 1);
        SeoRecord testSeoRecord = seoRecordList.get(seoRecordList.size() - 1);
        assertThat(testSeoRecord.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testSeoRecord.getCost()).isEqualTo(DEFAULT_COST);
        assertThat(testSeoRecord.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createSeoRecordWithExistingId() throws Exception {
        // Create the SeoRecord with an existing ID
        seoRecord.setId(1L);

        int databaseSizeBeforeCreate = seoRecordRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSeoRecordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seoRecord)))
            .andExpect(status().isBadRequest());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSeoRecords() throws Exception {
        // Initialize the database
        seoRecordRepository.saveAndFlush(seoRecord);

        // Get all the seoRecordList
        restSeoRecordMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(seoRecord.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].cost").value(hasItem(DEFAULT_COST.doubleValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getSeoRecord() throws Exception {
        // Initialize the database
        seoRecordRepository.saveAndFlush(seoRecord);

        // Get the seoRecord
        restSeoRecordMockMvc
            .perform(get(ENTITY_API_URL_ID, seoRecord.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(seoRecord.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.cost").value(DEFAULT_COST.doubleValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSeoRecord() throws Exception {
        // Get the seoRecord
        restSeoRecordMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSeoRecord() throws Exception {
        // Initialize the database
        seoRecordRepository.saveAndFlush(seoRecord);

        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();

        // Update the seoRecord
        SeoRecord updatedSeoRecord = seoRecordRepository.findById(seoRecord.getId()).get();
        // Disconnect from session so that the updates on updatedSeoRecord are not directly saved in db
        em.detach(updatedSeoRecord);
        updatedSeoRecord.date(UPDATED_DATE).cost(UPDATED_COST).status(UPDATED_STATUS);

        restSeoRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSeoRecord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSeoRecord))
            )
            .andExpect(status().isOk());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
        SeoRecord testSeoRecord = seoRecordList.get(seoRecordList.size() - 1);
        assertThat(testSeoRecord.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testSeoRecord.getCost()).isEqualTo(UPDATED_COST);
        assertThat(testSeoRecord.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingSeoRecord() throws Exception {
        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();
        seoRecord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSeoRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, seoRecord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(seoRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSeoRecord() throws Exception {
        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();
        seoRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeoRecordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(seoRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSeoRecord() throws Exception {
        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();
        seoRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeoRecordMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(seoRecord)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSeoRecordWithPatch() throws Exception {
        // Initialize the database
        seoRecordRepository.saveAndFlush(seoRecord);

        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();

        // Update the seoRecord using partial update
        SeoRecord partialUpdatedSeoRecord = new SeoRecord();
        partialUpdatedSeoRecord.setId(seoRecord.getId());

        partialUpdatedSeoRecord.cost(UPDATED_COST).status(UPDATED_STATUS);

        restSeoRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeoRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeoRecord))
            )
            .andExpect(status().isOk());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
        SeoRecord testSeoRecord = seoRecordList.get(seoRecordList.size() - 1);
        assertThat(testSeoRecord.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testSeoRecord.getCost()).isEqualTo(UPDATED_COST);
        assertThat(testSeoRecord.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateSeoRecordWithPatch() throws Exception {
        // Initialize the database
        seoRecordRepository.saveAndFlush(seoRecord);

        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();

        // Update the seoRecord using partial update
        SeoRecord partialUpdatedSeoRecord = new SeoRecord();
        partialUpdatedSeoRecord.setId(seoRecord.getId());

        partialUpdatedSeoRecord.date(UPDATED_DATE).cost(UPDATED_COST).status(UPDATED_STATUS);

        restSeoRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeoRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeoRecord))
            )
            .andExpect(status().isOk());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
        SeoRecord testSeoRecord = seoRecordList.get(seoRecordList.size() - 1);
        assertThat(testSeoRecord.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testSeoRecord.getCost()).isEqualTo(UPDATED_COST);
        assertThat(testSeoRecord.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingSeoRecord() throws Exception {
        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();
        seoRecord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSeoRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, seoRecord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(seoRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSeoRecord() throws Exception {
        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();
        seoRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeoRecordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(seoRecord))
            )
            .andExpect(status().isBadRequest());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSeoRecord() throws Exception {
        int databaseSizeBeforeUpdate = seoRecordRepository.findAll().size();
        seoRecord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeoRecordMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(seoRecord))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SeoRecord in the database
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSeoRecord() throws Exception {
        // Initialize the database
        seoRecordRepository.saveAndFlush(seoRecord);

        int databaseSizeBeforeDelete = seoRecordRepository.findAll().size();

        // Delete the seoRecord
        restSeoRecordMockMvc
            .perform(delete(ENTITY_API_URL_ID, seoRecord.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SeoRecord> seoRecordList = seoRecordRepository.findAll();
        assertThat(seoRecordList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
