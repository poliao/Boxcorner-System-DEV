package com.boxcorner.boxcorner.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class PapApiSoService {
    private final RestTemplate restTemplate = new RestTemplate();

    /* ===================== AUTH / FETCH ===================== */

    public Map<String, Object> getSamplePAP(String orderId) {
        String sessionId = login();
        String html = fetchHtml(sessionId, orderId);
        return extractAllFromHtml(html);
    }

    private String login() {
        String url = "https://boxcornerart.net/mypap/view/mypap_ctrl.php";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("login", "yuttana");
        body.add("z", "1234");
        body.add("request", "mypapUser.ajax_login");
        body.add("redirect", "https://boxcornerart.net/view");

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        String cookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        return cookie != null ? cookie.split(";")[0] : "";
    }

    private String fetchHtml(String cookie, String orderId) {
        String url = "https://boxcornerart.net/view/order.php?action=printex&oid=" + orderId;

        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", cookie);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        return restTemplate
                .exchange(url, HttpMethod.GET, entity, String.class)
                .getBody();
    }

    public Map<String, Object> extractAllFromHtml(String html) {
        Map<String, Object> result = new LinkedHashMap<>();
        Document doc = Jsoup.parse(html);

        Map<String, String> header = new LinkedHashMap<>();
        header.put("company_name", doc.select(".c-name").text().trim()); //
        header.put("tax_id", doc.select(".c-tax").text().replace("เลขประจำตัวผู้เสียภาษีอากร ", "").trim()); //
        header.put("document_title", doc.select(".doc-name span").text().trim()); //
        result.put("header", header);

        Map<String, String> customer = new LinkedHashMap<>();
        Elements cusRights = doc.select(".cus-info-right");
        if (cusRights.size() >= 3) {
            customer.put("name", cusRights.get(0).text().trim()); //
            customer.put("address", cusRights.get(1).text().trim()); //
            customer.put("contact_person", cusRights.get(2).text().trim()); //
        }
        result.put("customer_info", customer);

        Map<String, String> docInfo = new LinkedHashMap<>();
        for (Element el : doc.select(".doc-600")) {
            String label = el.select(".float-left").text().trim();
            String value = el.text().replace(label, "").trim();
            if (label.contains("วันที่"))
                docInfo.put("doc_date", value); //
            else if (label.contains("เลขที่เอกสาร"))
                docInfo.put("doc_no", value); //
            else if (label.contains("เซลล์"))
                docInfo.put("sale_name", value); //
            else if (label.contains("กำหนดยืนราคา"))
                docInfo.put("price_validity", value); //
        }
        result.put("document_info", docInfo);

        Map<String, String> jobSpecs = new LinkedHashMap<>();
        jobSpecs.put("job_name", doc.select(".job-box").text().trim()); //

        Element specTable = doc.select("table.text-xl").first();
        if (specTable != null) {
            Elements tds = specTable.select("td");
            for (int i = 0; i < tds.size(); i += 2) {
                if (i + 1 < tds.size()) {
                    String thaiKey = tds.get(i).text().replace(" :", "").trim();
                    String val = tds.get(i + 1).text().trim();
                    if (!thaiKey.isEmpty()) {
                        jobSpecs.put(translateKey(thaiKey), val); //
                    }
                }
            }
        }
        result.put("job_specifications", jobSpecs);

        Map<String, String> footerDetails = new LinkedHashMap<>();
        Element footerTable = doc.select("table").last();
        if (footerTable != null) {
            Elements rows = footerTable.select("tr");
            for (Element row : rows) {
                Elements ths = row.select("th");
                Elements tds = row.select("td");
                for (int i = 0; i < ths.size(); i++) {
                    String thaiKey = ths.get(i).text().replace(" :", "").trim();
                    String val = (i < tds.size()) ? tds.get(i).text().trim() : "";
                    if (!thaiKey.isEmpty()) {
                        footerDetails.put(translateKey(thaiKey), val); //
                    }
                }
            }
        }
        result.put("footer_details", footerDetails);

        // Status Confirmation
        result.put("is_confirmed", doc.select("input[type=checkbox]").first() != null &&
                doc.select("input[type=checkbox]").first().hasAttr("checked")); //

        return result;
    }

    private String translateKey(String thaiKey) {
        Map<String, String> keyMap = new HashMap<>();

        keyMap.put("ประเภทงาน", "work_type");
        keyMap.put("ระบบพิมพ์", "print_system");
        keyMap.put("ลักษณะงานพิมพ์", "print_style");
        keyMap.put("สีที่พิมพ์", "print_colors");
        keyMap.put("ขนาดกระดาษ", "paper_size");
        keyMap.put("แกรมกระดาษ", "paper_weight");
        keyMap.put("ลักษณะงานเคลือบ", "coating_style");
        keyMap.put("คำสั่งพิเศษ", "special_instructions");
        keyMap.put("ลักษณะงานไดคัท", "diecut_style");
        keyMap.put("หมายเหตุเพิ่มเติม", "additional_notes");
        keyMap.put("ชื่อผู้รับ", "receiver_name");
        keyMap.put("เบอร์ติดต่อ", "contact_number");
        keyMap.put("สถานที่จัดส่ง", "delivery_location");

        return keyMap.getOrDefault(thaiKey, thaiKey);
    }
}
