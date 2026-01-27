package com.boxcorner.boxcorner.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
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
public class ApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    /* ===================== PUBLIC ===================== */

    public Map<String, Object> getOrderData(String orderId) {
        String sessionId = login();
        String html = fetchHtml(sessionId, orderId);
        return extractFromHtml(html);
    }

    public Map<String, Object> parseHtmlToJson(String html) {
        return extractFromHtml(html);
    }

    /* ===================== AUTH / FETCH ===================== */

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
        String url = "https://boxcornerart.net/view/order.php?action=print&oid=" + orderId;

        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", cookie);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        return restTemplate
                .exchange(url, HttpMethod.GET, entity, String.class)
                .getBody();
    }

    /* ===================== CORE ===================== */

    private Map<String, Object> extractFromHtml(String html) {
        Document doc = Jsoup.parse(html);

        Map<String, Object> result = new LinkedHashMap<>();
        Map<String, String> header = extractHeader(doc);
        
        // เพิ่มจำนวนใบพิมพ์จากส่วน cutting - หาจากคอลัมน์จำนวนใบพิมพ์
        Element cuttingSection = section(doc, "แผนกงานตัด");
        if (cuttingSection != null) {
            String printSheets = "";
            
            // ลองหาจากคอลัมน์ "จำนวนใบพิมพ์" ก่อน
            Element printColumn = cuttingSection.selectFirst("div:contains(จำนวนใบพิมพ์)");
            if (printColumn != null) {
                Element parentRow = printColumn.parent();
                while (parentRow != null && !parentRow.tagName().equals("tr")) {
                    parentRow = parentRow.parent();
                }
                if (parentRow != null) {
                    Element nextRow = parentRow.nextElementSibling();
                    if (nextRow != null) {
                        var blueElements = nextRow.select("div.f-blue");
                        if (blueElements.size() >= 4) {
                            printSheets = blueElements.get(3).text().trim();
                        }
                    }
                }
            }
            // ถ้าไม่เจอ ใช้วิธีเดิม
            if (printSheets.isEmpty()) {
                int maxNumber = 0;
                var allBlueTexts = cuttingSection.select("div.f-blue");
                for (Element el : allBlueTexts) {
                    String txt = el.text().trim();
                    if (txt.matches("\\d+")) {
                        int num = Integer.parseInt(txt);
                        if (num > maxNumber) {
                            maxNumber = num;
                            printSheets = txt;
                        }
                    }
                }
            }
            
            header.put("print_sheets", printSheets);
        }
        
        result.put("header", header);
        return result;
    }

    /* ===================== HELPERS (NULL SAFE) ===================== */

    private String text(Element root, String css) {
        if (root == null) return "";
        Element el = root.selectFirst(css);
        return el != null ? el.text().replace("\u00A0", "").trim() : "";
    }

    private Element section(Document doc, String title) {
        if (doc == null) return null;
        return doc.selectFirst(
                "table:has(div.bg-l-yellow:matchesOwn(^\\s*" + title + "\\s*$))");
    }

    private String getBlueText(Element scope, String afterText) {
        if (scope == null) return "";
        Element target = scope.selectFirst("div:matchesOwn(^\\s*" + afterText + "\\s*$)");
        if (target != null) {
            Element next = target.nextElementSibling();
            return next != null ? text(next, "*") : "";
        }
        return "";
    }

    /* ===================== EXTRACTORS ===================== */

    private Map<String, String> extractHeader(Document doc) {
        Map<String, String> m = new LinkedHashMap<>();

        m.put("job_code", text(doc, ".pd-order:matches(JO\\d+)"));
        m.put("quotation", text(doc, ".pd-order:matches(QT\\d+)"));
        // หา Sale จากโครงสร้าง HTML ที่ถูกต้อง - ใช้ nth-child เพื่อเลือก .pd-order ที่ 3
        var pdOrders = doc.select(".pd-order");
        if (pdOrders.size() >= 3) {
            m.put("sale", pdOrders.get(2).text().trim());
        } else {
            m.put("sale", "");
        }
        
        Element header = doc.selectFirst(".e-head");
        if (header != null) {
            m.put("job_name", getBlueText(header, "ชื่องาน:"));
            m.put("customer_name", getBlueText(header, "ชื่อลูกค้า:"));
            m.put("customer_code", getBlueText(header, "รหัสลูกค้า:"));
            m.put("finished_size", getBlueText(header, "ขนาดสำเร็จ:"));
            m.put("receive_date", getBlueText(header, "วันที่รับงาน:"));
            m.put("quantity", getBlueText(header, "ยอดพิมพ์:"));
            m.put("delivery_date", getBlueText(header, "วันที่ส่งงาน:"));
            m.put("producer", getBlueText(header, "ผู้สั่งผลิต:"));
        }

        Element img = doc.selectFirst("img[src*='/image/job/']");
        m.put("image_url", img != null ? img.absUrl("src") : "");

        return m;
    }

   
    
}
