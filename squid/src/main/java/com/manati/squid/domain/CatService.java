package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.manati.squid.domain.enumeration.Status;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CatService.
 */
@Entity
@Table(name = "cat_service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CatService implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "category")
    private String category;

    @ManyToOne
    @JsonIgnoreProperties(value = { "location", "owner", "catalogs" }, allowSetters = true)
    private Business business;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CatService id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public CatService name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Status getStatus() {
        return this.status;
    }

    public CatService status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getCategory() {
        return this.category;
    }

    public CatService category(String category) {
        this.category = category;
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Business getBusiness() {
        return this.business;
    }

    public CatService business(Business business) {
        this.setBusiness(business);
        return this;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CatService)) {
            return false;
        }
        return id != null && id.equals(((CatService) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CatService{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
