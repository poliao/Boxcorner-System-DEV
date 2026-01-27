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
        String htmlValue = fetchHtmlValue(sessionId, orderId);
        Map<String, Object> result = extractFromHtml(html);
        Map<String, Object> formData = extractFormData(htmlValue);
        result.put("form_data", formData);
        return result;
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

    private String fetchHtmlValue(String cookie, String orderId) {
        String url = "https://boxcornerart.net/view/order.php?oid=" + orderId;

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

    private Map<String, Object> extractFormData(String html) {
        Document doc = Jsoup.parse(html);
        Map<String, Object> formData = new LinkedHashMap<>();
        
        // ข้อมูลพื้นฐาน
        formData.put("priority", getSelectValue(doc, "#priority"));
        formData.put("plan_delivery", getInputValue(doc, "#plan_delivery"));
        formData.put("dueto", getInputValue(doc, "#dueto"));
        formData.put("screen", getInputValue(doc, "#screen"));
        formData.put("times", getInputValue(doc, "#times"));
        
        // ข้อมูลการตัด
        formData.put("day_cut", getInputValue(doc, "#day_cut"));
        formData.put("cut_type", getInputValue(doc, "#cut_type"));
        
        // ข้อมูลการพิมพ์
        formData.put("printer", getInputValue(doc, "#printer"));
        formData.put("d_print", getInputValue(doc, "#d_print"));
        formData.put("confirm", getSelectValue(doc, "#confirm_s"));
        
        // ข้อมูลสถานที่และกำหนดส่ง
        formData.put("l_coat", getInputValue(doc, "#l_coat"));
        formData.put("d_coat", getInputValue(doc, "#d_coat"));
        formData.put("l_pcut", getInputValue(doc, "#l_pcut"));
        formData.put("d_pk", getInputValue(doc, "#d_pk"));
        formData.put("p_bk", getInputValue(doc, "#p_bk"));
        formData.put("n_o_bk", getSelectValue(doc, "#n_o_bk"));
        
        // ข้อมูลปั้มนูน
        formData.put("d_noon", getInputValue(doc, "#d_noon"));
        formData.put("p_noon", getInputValue(doc, "#p_noon"));
        formData.put("n_o_pd", getSelectValue(doc, "#n_o_pd"));
        
        // ข้อมูลปั้มไดคัท
        formData.put("d_daicut", getInputValue(doc, "#d_daicut"));
        formData.put("p_daicut", getInputValue(doc, "#p_daicut"));
        formData.put("n_o_dai", getSelectValue(doc, "#n_o_dai"));
        
        // ข้อมูลปะกล่อง
        formData.put("l_pa", getInputValue(doc, "#l_pa"));
        formData.put("d_pa", getInputValue(doc, "#d_pa"));
        
        // ข้อมูล QC
        formData.put("qc_num", getInputValue(doc, "#qc_num"));
        formData.put("qa", getSelectValue(doc, "#qa"));
        formData.put("st_num", getInputValue(doc, "#st_num"));
        formData.put("d_qc", getInputValue(doc, "#d_qc"));
        
        // ข้อมูลจัดส่ง
        formData.put("l_send", getInputValue(doc, "#l_send"));
        formData.put("type_send", getInputValue(doc, "#type_send"));
        formData.put("d_send", getInputValue(doc, "#d_send"));
        formData.put("l_place", getInputValue(doc, "#l_place"));
        
        // หมายเหตุต่างๆ
        formData.put("mold_remark", getTextareaValue(doc, "#mold_remark"));
        formData.put("cut_remark", getTextareaValue(doc, "#cut_remark"));
        formData.put("plate_remark", getTextareaValue(doc, "#plate_remark"));
        formData.put("coating_remark", getTextareaValue(doc, "#coating_remark"));
        formData.put("k_remark", getTextareaValue(doc, "#k_remark"));
        formData.put("noon_remark", getTextareaValue(doc, "#noon_remark"));
        formData.put("dai_remark", getTextareaValue(doc, "#dai_remark"));
        formData.put("pa_remark", getTextareaValue(doc, "#pa_remark"));
        formData.put("qc_remark", getTextareaValue(doc, "#qc_remark"));
        
        // ข้อมูลรูปภาพ
        Element jobPicInput = doc.selectFirst("input[name='job_pic']");
        if (jobPicInput != null) {
            formData.put("job_pic", jobPicInput.attr("value"));
        }
        
        Element jobPicImg = doc.selectFirst("image[src*='/image/job/']");
        if (jobPicImg != null) {
            formData.put("job_pic_url", jobPicImg.absUrl("src"));
        }
        
        // ข้อมูลใบสั่งงาน
        formData.put("order_no", getInputValue(doc, "#order_no"));
        formData.put("oid", getInputValue(doc, "#oid"));
        formData.put("qid", getInputValue(doc, "#qid"));
        
        return formData;
    }
    
    private String getInputValue(Document doc, String selector) {
        Element input = doc.selectFirst(selector);
        return input != null ? input.attr("value") : "";
    }
    
    private String getSelectValue(Document doc, String selector) {
        Element select = doc.selectFirst(selector);
        if (select != null) {
            Element selected = select.selectFirst("option[selected]");
            return selected != null ? selected.text() : "";
        }
        return "";
    }
    
    private String getTextareaValue(Document doc, String selector) {
        Element textarea = doc.selectFirst(selector);
        return textarea != null ? textarea.text() : "";
    }

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
            m.put("quantity", extractNumbers(getBlueText(header, "ยอดพิมพ์:")));
            m.put("delivery_date", getBlueText(header, "วันที่ส่งงาน:"));
            m.put("producer", getBlueText(header, "ผู้สั่งผลิต:"));
        }

        Element img = doc.selectFirst("img[src*='/image/job/']");
        m.put("image_url", img != null ? img.absUrl("src") : "");

        return m;
    }

    private String extractNumbers(String text) {
        if (text == null || text.isEmpty()) return "";
        return text.replaceAll("[^0-9,]", "").trim();
    }

   
    
}
