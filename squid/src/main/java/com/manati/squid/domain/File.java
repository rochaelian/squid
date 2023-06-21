package com.manati.squid.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A File.
 */
@Entity
@Table(name = "file")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class File implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "u_rl")
    private String uRL;

    @Lob
    @Column(name = "b_lob")
    private byte[] bLOB;

    @Column(name = "b_lob_content_type")
    private String bLOBContentType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "vehicle", "operator", "status", "orderRating", "transactions", "files" }, allowSetters = true)
    private Order order;

    @ManyToOne
    @JsonIgnoreProperties(value = { "status", "order", "businessService", "files" }, allowSetters = true)
    private ServiceOrder serviceOrder;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public File id(Long id) {
        this.id = id;
        return this;
    }

    public String getuRL() {
        return this.uRL;
    }

    public File uRL(String uRL) {
        this.uRL = uRL;
        return this;
    }

    public void setuRL(String uRL) {
        this.uRL = uRL;
    }

    public byte[] getbLOB() {
        return this.bLOB;
    }

    public File bLOB(byte[] bLOB) {
        this.bLOB = bLOB;
        return this;
    }

    public void setbLOB(byte[] bLOB) {
        this.bLOB = bLOB;
    }

    public String getbLOBContentType() {
        return this.bLOBContentType;
    }

    public File bLOBContentType(String bLOBContentType) {
        this.bLOBContentType = bLOBContentType;
        return this;
    }

    public void setbLOBContentType(String bLOBContentType) {
        this.bLOBContentType = bLOBContentType;
    }

    public Order getOrder() {
        return this.order;
    }

    public File order(Order order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public ServiceOrder getServiceOrder() {
        return this.serviceOrder;
    }

    public File serviceOrder(ServiceOrder serviceOrder) {
        this.setServiceOrder(serviceOrder);
        return this;
    }

    public void setServiceOrder(ServiceOrder serviceOrder) {
        this.serviceOrder = serviceOrder;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof File)) {
            return false;
        }
        return id != null && id.equals(((File) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "File{" +
            "id=" + getId() +
            ", uRL='" + getuRL() + "'" +
            ", bLOB='" + getbLOB() + "'" +
            ", bLOBContentType='" + getbLOBContentType() + "'" +
            "}";
    }
}
