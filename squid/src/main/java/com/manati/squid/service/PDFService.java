package com.manati.squid.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.manati.squid.domain.Order;
import com.manati.squid.domain.User;
import com.manati.squid.domain.Vehicle;
import com.manati.squid.repository.UserRepository;
import com.manati.squid.repository.VehicleRepository;
import java.io.ByteArrayOutputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.Optional;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PDFService {

    private final MailService mailService;

    private final UserRepository userRepository;

    private final VehicleRepository vehicleRepository;

    public PDFService(MailService mailService, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.mailService = mailService;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public void createPDF(Order order, String fileName) {
        /* first, get and initialize an engine */
        VelocityEngine ve = new VelocityEngine();

        User user = buscarUsuario(order);
        Vehicle vehicle = buscarVehiculo(order);
        String name = user.getFirstName() + " " + user.getLastName();
        String cedula = "102920293";

        /* next, get the Template */
        ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
        ve.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        ve.init();
        Template t = ve.getTemplate("templates/pdf/invoice.html");
        /* create a context and add data */
        VelocityContext context = new VelocityContext();
        context.put("fechaEmision", LocalDateTime.now().toString());
        context.put("cliente", name);
        context.put("cedula", cedula);
        context.put("correo", user.getEmail());
        context.put("placa", vehicle.getPlate());
        context.put("num", order.getId());
        context.put("descripcion", "Servicios de Squid");
        context.put("monto", order.getTotalCost());
        context.put("subtotal", order.getTotalCost());
        context.put("iva", "13%");
        context.put("total", (order.getTotalCost() + (order.getTotalCost() * 0.13)));
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

        mailService.sendInvoiceEmail(user, baos.toByteArray());
    }

    public Vehicle buscarVehiculo(Order order) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(order.getVehicle().getId());
        Vehicle vec = vehicle.get();
        return vec;
    }

    public User buscarUsuario(Order order) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(order.getVehicle().getId());
        Vehicle vec = vehicle.get();
        User result = new User();
        if (vec != null) {
            Optional<User> user = userRepository.findById(vec.getUser().getId());
            result = user.get();
        }

        return result;
    }

    public ByteArrayOutputStream generatePdf(String html) {
        String pdfFilePath = "";
        PdfWriter pdfWriter = null;

        // create a new document
        Document document = new Document();
        try {
            document = new Document();
            // document header attributes
            document.addAuthor("Squid");
            document.addAuthor("Manati");
            document.addCreationDate();
            document.addProducer();
            document.addCreator("squid.github.io");
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
