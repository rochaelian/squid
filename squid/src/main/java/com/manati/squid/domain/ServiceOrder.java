package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ServiceOrder.
 */
@Entity
@Table(name = "service_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ServiceOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "deductible")
    private Double deductible;

    @Column(name = "updated_cost")
    private Double updatedCost;

    @Column(name = "comment")
    private String comment;

    @ManyToOne
    @JsonIgnoreProperties(value = { "businesses" }, allowSetters = true)
    private Catalog status;

    @ManyToOne
    @JsonIgnoreProperties(value = { "vehicle", "operator", "status", "orderRating", "transactions", "files" }, allowSetters = true)
    private Order order;

    @ManyToOne
    //@JsonIgnoreProperties(value = { "service" }, allowSetters = true)
    //@JsonIgnoreProperties(value = { "order", "business" }, allowSetters = true)
    private BusinessService businessService;

    @OneToMany(mappedBy = "serviceOrder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "order", "serviceOrder" }, allowSetters = true)
    private Set<File> files = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ServiceOrder id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public ServiceOrder startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public ServiceOrder endDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getDeductible() {
        return this.deductible;
    }

    public ServiceOrder deductible(Double deductible) {
        this.deductible = deductible;
        return this;
    }

    public void setDeductible(Double deductible) {
        this.deductible = deductible;
    }

    public Double getUpdatedCost() {
        return this.updatedCost;
    }

    public ServiceOrder updatedCost(Double updatedCost) {
        this.updatedCost = updatedCost;
        return this;
    }

    public void setUpdatedCost(Double updatedCost) {
        this.updatedCost = updatedCost;
    }

    public String getComment() {
        return this.comment;
    }

    public ServiceOrder comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Catalog getStatus() {
        return this.status;
    }

    public ServiceOrder status(Catalog catalog) {
        this.setStatus(catalog);
        return this;
    }

    public void setStatus(Catalog catalog) {
        this.status = catalog;
    }

    public Order getOrder() {
        return this.order;
    }

    public ServiceOrder order(Order order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public BusinessService getBusinessService() {
        return this.businessService;
    }

    public ServiceOrder businessService(BusinessService businessService) {
        this.setBusinessService(businessService);
        return this;
    }

    public void setBusinessService(BusinessService businessService) {
        this.businessService = businessService;
    }

    public Set<File> getFiles() {
        return this.files;
    }

    public ServiceOrder files(Set<File> files) {
        this.setFiles(files);
        return this;
    }

    public ServiceOrder addFile(File file) {
        this.files.add(file);
        file.setServiceOrder(this);
        return this;
    }

    public ServiceOrder removeFile(File file) {
        this.files.remove(file);
        file.setServiceOrder(null);
        return this;
    }

    public void setFiles(Set<File> files) {
        if (this.files != null) {
            this.files.forEach(i -> i.setServiceOrder(null));
        }
        if (files != null) {
            files.forEach(i -> i.setServiceOrder(this));
        }
        this.files = files;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ServiceOrder)) {
            return false;
        }
        return id != null && id.equals(((ServiceOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ServiceOrder{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", deductible=" + getDeductible() +
            ", updatedCost=" + getUpdatedCost() +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
