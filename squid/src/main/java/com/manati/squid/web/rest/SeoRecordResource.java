package com.manati.squid.web.rest;

import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.manati.squid.domain.Business;
import com.manati.squid.domain.SeoRecord;
import com.manati.squid.domain.User;
import com.manati.squid.domain.enumeration.Status;
import com.manati.squid.repository.BusinessRepository;
import com.manati.squid.repository.SeoRecordRepository;
import com.manati.squid.repository.UserRepository;
import com.manati.squid.service.MailService;
import com.manati.squid.web.rest.errors.BadRequestAlertException;
//

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manati.squid.domain.SeoRecord}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SeoRecordResource {

    private final Logger log = LoggerFactory.getLogger(SeoRecordResource.class);

    private static final String ENTITY_NAME = "seoRecord";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SeoRecordRepository seoRecordRepository;

    private final BusinessRepository businessRepository;

    private final MailService mailService;

    private final UserRepository userRepository;

    public SeoRecordResource(
        SeoRecordRepository seoRecordRepository,
        BusinessRepository businessRepository,
        MailService mailService,
        UserRepository userRepository
    ) {
        this.seoRecordRepository = seoRecordRepository;
        this.businessRepository = businessRepository;
        this.mailService = mailService;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /seo-records} : Create a new seoRecord.
     *
     * @param seoRecord the seoRecord to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new seoRecord, or with status {@code 400 (Bad Request)} if the seoRecord has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/seo-records")
    public ResponseEntity<SeoRecord> createSeoRecord(@RequestBody SeoRecord seoRecord) throws URISyntaxException {
        log.debug("REST request to save SeoRecord : {}", seoRecord);
        if (seoRecord.getId() != null) {
            throw new BadRequestAlertException("A new seoRecord cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SeoRecord result = seoRecordRepository.save(seoRecord);
        return ResponseEntity
            .created(new URI("/api/seo-records/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(false, ENTITY_NAME, "", result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /seo-records/:id} : Updates an existing seoRecord.
     *
     * @param id the id of the seoRecord to save.
     * @param seoRecord the seoRecord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seoRecord,
     * or with status {@code 400 (Bad Request)} if the seoRecord is not valid,
     * or with status {@code 500 (Internal Server Error)} if the seoRecord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/seo-records/{id}")
    public ResponseEntity<SeoRecord> updateSeoRecord(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SeoRecord seoRecord
    ) throws URISyntaxException {
        log.debug("REST request to update SeoRecord : {}, {}", id, seoRecord);
        if (seoRecord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, seoRecord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seoRecordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SeoRecord result = seoRecordRepository.save(seoRecord);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", seoRecord.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /seo-records/:id} : Partial updates given fields of an existing seoRecord, field will ignore if it is null
     *
     * @param id the id of the seoRecord to save.
     * @param seoRecord the seoRecord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seoRecord,
     * or with status {@code 400 (Bad Request)} if the seoRecord is not valid,
     * or with status {@code 404 (Not Found)} if the seoRecord is not found,
     * or with status {@code 500 (Internal Server Error)} if the seoRecord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/seo-records/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SeoRecord> partialUpdateSeoRecord(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SeoRecord seoRecord
    ) throws URISyntaxException {
        log.debug("REST request to partial update SeoRecord partially : {}, {}", id, seoRecord);
        if (seoRecord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, seoRecord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seoRecordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SeoRecord> result = seoRecordRepository
            .findById(seoRecord.getId())
            .map(
                existingSeoRecord -> {
                    if (seoRecord.getDate() != null) {
                        existingSeoRecord.setDate(seoRecord.getDate());
                    }
                    if (seoRecord.getCost() != null) {
                        existingSeoRecord.setCost(seoRecord.getCost());
                    }
                    if (seoRecord.getStatus() != null) {
                        existingSeoRecord.setStatus(seoRecord.getStatus());
                    }

                    return existingSeoRecord;
                }
            )
            .map(seoRecordRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(false, ENTITY_NAME, "", seoRecord.getId().toString())
        );
    }

    /**
     * {@code GET  /seo-records} : get all the seoRecords.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seoRecords in body.
     */
    @GetMapping("/seo-records")
    public List<SeoRecord> getAllSeoRecords() {
        log.debug("REST request to get all SeoRecords");
        return seoRecordRepository.findAll();
    }

    /**
     * {@code GET  /seo-records} : get cost sum of all the seoRecords.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seoRecords in body.
     */
    @GetMapping("/seo-records-cost-sum")
    public Integer getAllSeoRecordsCostSum() {
        log.debug("REST request to get all SeoRecords sum cost");
        return seoRecordRepository.getAllCost();
    }

    /**
     * {@code GET  /seo-records-by-business} : get all the seoRecords by business id.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seoRecords in body.
     */
    @GetMapping("/seo-records-by-business/{id}")
    public Boolean getAllSeoRecordsByBusiness(@PathVariable Long id) {
        log.debug("REST request to get all SeoRecords by business");
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int month = localDate.getMonthValue();
        int year = localDate.getYear();
        Boolean activated = false;
        Status enabledStatus = Status.Enabled;
        Status pendingStatus = Status.Pending;

        List<SeoRecord> historial = seoRecordRepository.findAllByBusiness_Id(id);
        if (historial.size() > 0) {
            for (SeoRecord s : historial) {
                if (
                    s.getDate().getMonthValue() == month &&
                    s.getDate().getYear() == year &&
                    (s.getStatus().equals(enabledStatus) || s.getStatus().equals(pendingStatus))
                ) {
                    activated = true;
                }
            }
        }

        return activated;
    }

    /**
     * {@code GET  /seo-records-by-business} : get all the seoRecords by business id.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seoRecords in body.
     */
    @GetMapping("/seo-records-pending/{id}")
    public Boolean getPendingSEO(@PathVariable Long id) {
        log.debug("REST request to get all SeoRecords by business");
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        int month = localDate.getMonthValue();
        int year = localDate.getYear();
        Boolean pending = false;
        Status pendingStatus = Status.Pending;

        List<SeoRecord> historial = seoRecordRepository.findAllByBusiness_Id(id);
        if (historial.size() > 0) {
            for (SeoRecord s : historial) {
                if (s.getDate().getMonthValue() == month && s.getDate().getYear() == year && s.getStatus().equals(pendingStatus)) {
                    pending = true;
                }
            }
        }

        return pending;
    }

    /**
     * {@code PUT  /seo-records/:id} : Updates an existing seoRecord.
     *
     * @param id the id of the seoRecord to save.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seoRecord,
     * or with status {@code 400 (Bad Request)} if the seoRecord is not valid,
     * or with status {@code 500 (Internal Server Error)} if the seoRecord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @GetMapping(value = "/seo-records-updated/{id}", params = { "value" })
    public Boolean updateSeoRecordStatus(@PathVariable Long id, @RequestParam("value") Boolean value) {
        Date date = new Date();
        LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate lt = LocalDate.now();
        int month = localDate.getMonthValue();
        int year = localDate.getYear();
        Boolean activated = false;
        Boolean findValue = false;
        SeoRecord seoRecord = new SeoRecord();
        Status enabledStatus = Status.Enabled;
        Status disabledStatus = Status.Disabled;
        Status pendingStatus = Status.Pending;
        Optional<Business> business = businessRepository.findById(id);

        List<SeoRecord> historial = seoRecordRepository.findAllByBusiness_Id(id);
        if (historial.size() > 0) {
            for (SeoRecord s : historial) {
                if (s.getDate().getMonthValue() == month && s.getDate().getYear() == year) {
                    if (value) {
                        seoRecord = s;
                        seoRecord.setStatus(disabledStatus);
                        seoRecordRepository.save(seoRecord);
                        findValue = true;
                    } else {
                        seoRecord = s;
                        seoRecord.setStatus(enabledStatus);
                        seoRecordRepository.save(seoRecord);
                        findValue = true;
                        activated = true;
                    }
                }
            }
        }

        if (!findValue) {
            if (!value) {
                seoRecord.setBusiness(business.get());
                seoRecord.setCost(0.0);
                seoRecord.setStatus(pendingStatus);
                seoRecord.setDate(lt);
                seoRecordRepository.save(seoRecord);
                activated = true;
            }
        }

        return activated;
    }

    /**
     * {@code GET  /seo-records/:id} : get the "id" seoRecord.
     *
     * @param id the id of the seoRecord to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the seoRecord, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/seo-records/{id}")
    public ResponseEntity<SeoRecord> getSeoRecord(@PathVariable Long id) {
        log.debug("REST request to get SeoRecord : {}", id);
        Optional<SeoRecord> seoRecord = seoRecordRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(seoRecord);
    }

    /**
     * {@code DELETE  /seo-records/:id} : delete the "id" seoRecord.
     *
     * @param id the id of the seoRecord to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/seo-records/{id}")
    public ResponseEntity<Void> deleteSeoRecord(@PathVariable Long id) {
        log.debug("REST request to delete SeoRecord : {}", id);
        seoRecordRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(false, ENTITY_NAME, "", id.toString())).build();
    }

    /**
     * {@code GET  /seo-records} : get all enable and current seoRecords.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seoRecords in body.
     */
    @GetMapping("/seo-records-enabled")
    public List<SeoRecord> getAllEnabledSeoRecords() {
        log.debug("REST request to get all enabled SeoRecords");
        Status seoStatus = Status.Enabled;
        List<SeoRecord> allSeoRecords = seoRecordRepository.findAllEnabledSeoRecord(seoStatus);
        return seoRecordRepository.findAllEnabledSeoRecord(seoStatus);
    }

    @GetMapping("/genpdf/{fileName}")
    HttpEntity<byte[]> createPdf(@PathVariable("fileName") String fileName) throws IOException {
        /* first, get and initialize an engine */
        VelocityEngine ve = new VelocityEngine();

        /* next, get the Template */
        ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
        ve.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        ve.init();
        Template t = ve.getTemplate("templates/pdf/invoice.html");
        /* create a context and add data */
        VelocityContext context = new VelocityContext();
        context.put("fechaEmision", LocalDateTime.now().toString());
        context.put("cliente", "World");
        context.put("cedula", "World");
        context.put("correo", "World");
        context.put("telefono", "World");
        context.put("num", "World");
        context.put("descripcion", "World");
        context.put("monto", "World");
        context.put("subtotal", "World");
        context.put("descuento", "World");
        context.put("exento", "World");
        context.put("iva", "World");
        context.put("total", "World");
        /* now render the template into a StringWriter */
        StringWriter writer = new StringWriter();
        t.merge(context, writer);
        /* show the World */
        System.out.println(writer.toString());

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        baos = generatePdf(writer.toString());

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_PDF);
        header.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName.replace(" ", "_"));
        header.setContentLength(baos.toByteArray().length);

        Long l = new Long(71);
        Optional<User> user = userRepository.findById(l);

        mailService.sendInvoiceEmail(user.get(), baos.toByteArray());

        return new HttpEntity<byte[]>(baos.toByteArray(), header);
    }

    public ByteArrayOutputStream generatePdf(String html) {
        String pdfFilePath = "";
        PdfWriter pdfWriter = null;

        // create a new document
        Document document = new Document();
        try {
            document = new Document();
            // document header attributes
            document.addAuthor("Kinns");
            document.addAuthor("Kinns123");
            document.addCreationDate();
            document.addProducer();
            document.addCreator("kinns123.github.io");
            document.addTitle("HTML to PDF using itext");
            document.setPageSize(PageSize.LETTER);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            // open document
            document.open();

            XMLWorkerHelper xmlWorkerHelper = XMLWorkerHelper.getInstance();
            xmlWorkerHelper.getDefaultCssResolver(true);
            xmlWorkerHelper.parseXHtml(pdfWriter, document, new StringReader(html));
            // close the document
            document.close();
            System.out.println("PDF generated successfully");

            return baos;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
