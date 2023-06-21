package com.manati.squid.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A APP.
 */
@Entity
@Table(name = "app")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class APP implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type")
    private Integer type;

    @Column(name = "income")
    private Double income;

    @Column(name = "comission")
    private Double comission;

    @Column(name = "s_eo_cost")
    private Double sEOCost;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public APP id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getType() {
        return this.type;
    }

    public APP type(Integer type) {
        this.type = type;
        return this;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Double getIncome() {
        return this.income;
    }

    public APP income(Double income) {
        this.income = income;
        return this;
    }

    public void setIncome(Double income) {
        this.income = income;
    }

    public Double getComission() {
        return this.comission;
    }

    public APP comission(Double comission) {
        this.comission = comission;
        return this;
    }

    public void setComission(Double comission) {
        this.comission = comission;
    }

    public Double getsEOCost() {
        return this.sEOCost;
    }

    public APP sEOCost(Double sEOCost) {
        this.sEOCost = sEOCost;
        return this;
    }

    public void setsEOCost(Double sEOCost) {
        this.sEOCost = sEOCost;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof APP)) {
            return false;
        }
        return id != null && id.equals(((APP) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "APP{" +
            "id=" + getId() +
            ", type=" + getType() +
            ", income=" + getIncome() +
            ", comission=" + getComission() +
            ", sEOCost=" + getsEOCost() +
            "}";
    }
}
