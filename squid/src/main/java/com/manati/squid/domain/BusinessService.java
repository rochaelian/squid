package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BusinessService.
 */
@Entity
@Table(name = "business_service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BusinessService implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price")
    private Double price;

    @Column(name = "duration")
    private Integer duration;

    @ManyToOne
    @JsonIgnoreProperties(value = { "location", "owner", "catalogs" }, allowSetters = true)
    private Business business;

    @ManyToOne
    @JsonIgnoreProperties(value = { "business" }, allowSetters = true)
    private CatService service;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BusinessService id(Long id) {
        this.id = id;
        return this;
    }

    public Double getPrice() {
        return this.price;
    }

    public BusinessService price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public BusinessService duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Business getBusiness() {
        return this.business;
    }

    public BusinessService business(Business business) {
        this.setBusiness(business);
        return this;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public CatService getService() {
        return this.service;
    }

    public BusinessService service(CatService catService) {
        this.setService(catService);
        return this;
    }

    public void setService(CatService catService) {
        this.service = catService;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BusinessService)) {
            return false;
        }
        return id != null && id.equals(((BusinessService) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BusinessService{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", duration=" + getDuration() +
            "}";
    }
}
