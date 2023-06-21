package com.manati.squid.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.manati.squid.IntegrationTest;
import com.manati.squid.domain.ServiceOrder;
import com.manati.squid.repository.ServiceOrderRepository;
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
 * Integration tests for the {@link ServiceOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceOrderResourceIT {

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_DEDUCTIBLE = 1D;
    private static final Double UPDATED_DEDUCTIBLE = 2D;

    private static final Double DEFAULT_UPDATED_COST = 1D;
    private static final Double UPDATED_UPDATED_COST = 2D;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/service-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceOrderRepository serviceOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceOrderMockMvc;

    private ServiceOrder serviceOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceOrder createEntity(EntityManager em) {
        ServiceOrder serviceOrder = new ServiceOrder()
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .deductible(DEFAULT_DEDUCTIBLE)
            .updatedCost(DEFAULT_UPDATED_COST)
            .comment(DEFAULT_COMMENT);
        return serviceOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceOrder createUpdatedEntity(EntityManager em) {
        ServiceOrder serviceOrder = new ServiceOrder()
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .deductible(UPDATED_DEDUCTIBLE)
            .updatedCost(UPDATED_UPDATED_COST)
            .comment(UPDATED_COMMENT);
        return serviceOrder;
    }

    @BeforeEach
    public void initTest() {
        serviceOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceOrder() throws Exception {
        int databaseSizeBeforeCreate = serviceOrderRepository.findAll().size();
        // Create the ServiceOrder
        restServiceOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceOrder)))
            .andExpect(status().isCreated());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceOrder testServiceOrder = serviceOrderList.get(serviceOrderList.size() - 1);
        assertThat(testServiceOrder.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testServiceOrder.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testServiceOrder.getDeductible()).isEqualTo(DEFAULT_DEDUCTIBLE);
        assertThat(testServiceOrder.getUpdatedCost()).isEqualTo(DEFAULT_UPDATED_COST);
        assertThat(testServiceOrder.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createServiceOrderWithExistingId() throws Exception {
        // Create the ServiceOrder with an existing ID
        serviceOrder.setId(1L);

        int databaseSizeBeforeCreate = serviceOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllServiceOrders() throws Exception {
        // Initialize the database
        serviceOrderRepository.saveAndFlush(serviceOrder);

        // Get all the serviceOrderList
        restServiceOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].deductible").value(hasItem(DEFAULT_DEDUCTIBLE.doubleValue())))
            .andExpect(jsonPath("$.[*].updatedCost").value(hasItem(DEFAULT_UPDATED_COST.doubleValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getServiceOrder() throws Exception {
        // Initialize the database
        serviceOrderRepository.saveAndFlush(serviceOrder);

        // Get the serviceOrder
        restServiceOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceOrder.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.deductible").value(DEFAULT_DEDUCTIBLE.doubleValue()))
            .andExpect(jsonPath("$.updatedCost").value(DEFAULT_UPDATED_COST.doubleValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingServiceOrder() throws Exception {
        // Get the serviceOrder
        restServiceOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewServiceOrder() throws Exception {
        // Initialize the database
        serviceOrderRepository.saveAndFlush(serviceOrder);

        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();

        // Update the serviceOrder
        ServiceOrder updatedServiceOrder = serviceOrderRepository.findById(serviceOrder.getId()).get();
        // Disconnect from session so that the updates on updatedServiceOrder are not directly saved in db
        em.detach(updatedServiceOrder);
        updatedServiceOrder
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .deductible(UPDATED_DEDUCTIBLE)
            .updatedCost(UPDATED_UPDATED_COST)
            .comment(UPDATED_COMMENT);

        restServiceOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceOrder))
            )
            .andExpect(status().isOk());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
        ServiceOrder testServiceOrder = serviceOrderList.get(serviceOrderList.size() - 1);
        assertThat(testServiceOrder.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testServiceOrder.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testServiceOrder.getDeductible()).isEqualTo(UPDATED_DEDUCTIBLE);
        assertThat(testServiceOrder.getUpdatedCost()).isEqualTo(UPDATED_UPDATED_COST);
        assertThat(testServiceOrder.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingServiceOrder() throws Exception {
        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();
        serviceOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceOrder() throws Exception {
        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();
        serviceOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceOrder() throws Exception {
        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();
        serviceOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceOrderWithPatch() throws Exception {
        // Initialize the database
        serviceOrderRepository.saveAndFlush(serviceOrder);

        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();

        // Update the serviceOrder using partial update
        ServiceOrder partialUpdatedServiceOrder = new ServiceOrder();
        partialUpdatedServiceOrder.setId(serviceOrder.getId());

        partialUpdatedServiceOrder.startDate(UPDATED_START_DATE).deductible(UPDATED_DEDUCTIBLE).updatedCost(UPDATED_UPDATED_COST);

        restServiceOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceOrder))
            )
            .andExpect(status().isOk());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
        ServiceOrder testServiceOrder = serviceOrderList.get(serviceOrderList.size() - 1);
        assertThat(testServiceOrder.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testServiceOrder.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testServiceOrder.getDeductible()).isEqualTo(UPDATED_DEDUCTIBLE);
        assertThat(testServiceOrder.getUpdatedCost()).isEqualTo(UPDATED_UPDATED_COST);
        assertThat(testServiceOrder.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateServiceOrderWithPatch() throws Exception {
        // Initialize the database
        serviceOrderRepository.saveAndFlush(serviceOrder);

        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();

        // Update the serviceOrder using partial update
        ServiceOrder partialUpdatedServiceOrder = new ServiceOrder();
        partialUpdatedServiceOrder.setId(serviceOrder.getId());

        partialUpdatedServiceOrder
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .deductible(UPDATED_DEDUCTIBLE)
            .updatedCost(UPDATED_UPDATED_COST)
            .comment(UPDATED_COMMENT);

        restServiceOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceOrder))
            )
            .andExpect(status().isOk());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
        ServiceOrder testServiceOrder = serviceOrderList.get(serviceOrderList.size() - 1);
        assertThat(testServiceOrder.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testServiceOrder.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testServiceOrder.getDeductible()).isEqualTo(UPDATED_DEDUCTIBLE);
        assertThat(testServiceOrder.getUpdatedCost()).isEqualTo(UPDATED_UPDATED_COST);
        assertThat(testServiceOrder.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingServiceOrder() throws Exception {
        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();
        serviceOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceOrder() throws Exception {
        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();
        serviceOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceOrder() throws Exception {
        int databaseSizeBeforeUpdate = serviceOrderRepository.findAll().size();
        serviceOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOrderMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(serviceOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceOrder in the database
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceOrder() throws Exception {
        // Initialize the database
        serviceOrderRepository.saveAndFlush(serviceOrder);

        int databaseSizeBeforeDelete = serviceOrderRepository.findAll().size();

        // Delete the serviceOrder
        restServiceOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceOrder> serviceOrderList = serviceOrderRepository.findAll();
        assertThat(serviceOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
