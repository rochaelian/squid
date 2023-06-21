package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.manati.squid.domain.enumeration.Status;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Catalog.
 */
@Entity
@Table(name = "catalog")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Catalog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @ManyToMany(mappedBy = "catalogs")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "location", "owner", "catalogs" }, allowSetters = true)
    private Set<Business> businesses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Catalog id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Catalog name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public Catalog type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Status getStatus() {
        return this.status;
    }

    public Catalog status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Set<Business> getBusinesses() {
        return this.businesses;
    }

    public Catalog businesses(Set<Business> businesses) {
        this.setBusinesses(businesses);
        return this;
    }

    public Catalog addBusiness(Business business) {
        this.businesses.add(business);
        business.getCatalogs().add(this);
        return this;
    }

    public Catalog removeBusiness(Business business) {
        this.businesses.remove(business);
        business.getCatalogs().remove(this);
        return this;
    }

    public void setBusinesses(Set<Business> businesses) {
        if (this.businesses != null) {
            this.businesses.forEach(i -> i.removeCatalog(this));
        }
        if (businesses != null) {
            businesses.forEach(i -> i.addCatalog(this));
        }
        this.businesses = businesses;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Catalog)) {
            return false;
        }
        return id != null && id.equals(((Catalog) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Catalog{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
