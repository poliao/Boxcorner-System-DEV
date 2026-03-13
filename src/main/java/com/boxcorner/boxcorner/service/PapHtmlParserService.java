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

/**
 * Service สำหรับ parse HTML ของใบสั่งผลิต (print page) จากระบบ boxcornerart.net
 * แล้วคืนเป็น Map (JSON-friendly) แบ่งตาม section ของใบงาน
 *
 * Endpoint ที่ใช้งาน: POST /api/pap/parseHtml
 */
@Service
public class PapHtmlParserService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getOrderDataJob(String orderId) {
        String sessionId = login();
        String html = fetchHtml(sessionId, orderId);

        Map<String, Object> result = parse(html);
        return result;
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
        String url = "https://boxcornerart.net/view/order.php?action=print&oid=" + orderId;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", cookie);
        return restTemplate
                .exchange(url, HttpMethod.GET, new HttpEntity<>(headers), String.class)
                .getBody();
    }

    /* ===================== PUBLIC ===================== */

    public Map<String, Object> parse(String html) {
        Document doc = Jsoup.parse(html);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("header", extractHeader(doc));
        result.put("platemaking", extractPlatemaking(doc));
        result.put("cutting", extractCutting(doc));
        result.put("printing", extractPrinting(doc));
        result.put("coating", extractCoating(doc));
        result.put("dieCutting", extractDieCutting(doc));
        result.put("gluing", extractGluing(doc));
        result.put("qcAndDelivery", extractQcDelivery(doc));
        return result;
    }

    /* ===================== HEADER ===================== */

    private Map<String, Object> extractHeader(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();

        // JO / QN / QT code — ดึงตาม position ของ .pd-order
        // index 0 = JO Code, index 1 = ใบเสนอราคา (QN/QT/etc.), index 2 = Sale
        var pdOrders = doc.select(".pd-order");
        m.put("jobCode", pdOrders.size() > 0 ? pdOrders.get(0).text().trim() : "");
        m.put("quotation", pdOrders.size() > 1 ? pdOrders.get(1).text().trim() : "");
        m.put("sale", pdOrders.size() > 2 ? pdOrders.get(2).text().trim() : "");

        Element head = doc.selectFirst(".e-head");
        if (head != null) {
            m.put("jobName", getBlueText(head, "ชื่องาน:"));
            m.put("customerName", getBlueText(head, "ชื่อลูกค้า:"));
            m.put("customerId", getBlueText(head, "รหัสลูกค้า:"));
            m.put("finishedSize", getBlueText(head, "ขนาดสำเร็จ:"));
            m.put("receivedDate", getBlueText(head, "วันที่รับงาน:"));
            m.put("totalPrintQty", extractNumbers(getBlueText(head, "ยอดพิมพ์:")));
            m.put("deliveryDate", getBlueText(head, "วันที่ส่งงาน:"));
            m.put("orderedBy", getBlueText(head, "ผู้สั่งผลิต:"));
        }

        // รองรับทั้ง /image/job/ และ /image/temp/ — ดูจาก div.order-image แทน
        Element imgWrapper = doc.selectFirst("div.order-image img");
        if (imgWrapper == null)
            imgWrapper = doc.selectFirst("img[src*='/image/']");
        m.put("imageUrl", imgWrapper != null ? imgWrapper.absUrl("src") : "");

        return m;
    }

    /* ===================== SECTION EXTRACTORS ===================== */

    private Map<String, Object> extractPlatemaking(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        Element sec = section(doc, "จัดทำแม่พิมพ์");
        if (sec == null)
            return m;

        m.put("date", blueAt(sec, 0));

        Element detailRow = nthRow(sec, 1);
        if (detailRow != null) {
            var b = detailRow.select("div.f-blue");
            m.put("jobOrderId", get(b, 0));
            m.put("colors", get(b, 1));
            m.put("screenDot", get(b, 2));
            m.put("size", get(b, 3));
            m.put("round", get(b, 4));
        }

        Element noteRow = nthRow(sec, 2);
        if (noteRow != null) {
            var b = noteRow.select("div.f-blue");
            m.put("note", get(b, 0));
            m.put("responsiblePerson", get(b, 1));
        }
        return m;
    }

    private Map<String, Object> extractCutting(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        Element sec = section(doc, "แผนกงานตัด");
        if (sec == null)
            return m;

        // Header row: วันที่ / รูปแบบตัด / ผู้รับผิดชอบ
        Element hdr = sec.selectFirst("th:has(div.bg-l-yellow)");
        if (hdr != null) {
            var b = hdr.select("div.f-blue");
            m.put("date", get(b, 0));
            m.put("cutPattern", get(b, 1));
            m.put("responsiblePerson", get(b, 2));
        }

        // Paper row: แถวที่มี f-blue >= 5 ค่า
        for (Element th : sec.select("th")) {
            var b = th.select("div.f-blue");
            if (b.size() >= 5) {
                Map<String, Object> paper = new LinkedHashMap<>();
                paper.put("type", get(b, 0));
                paper.put("cut", get(b, 1));
                paper.put("printSize", get(b, 2));
                paper.put("printQty", get(b, 3));
                paper.put("machineSetup", get(b, 4));
                m.put("paper", paper);
                break;
            }
        }

        // Note row: แถวสุดท้ายที่มี f-blue แต่ไม่ใช่ paper row
        var blueRows = sec.select("th:has(div.f-blue)");
        if (!blueRows.isEmpty()) {
            var b = blueRows.last().select("div.f-blue");
            if (b.size() < 5) {
                m.put("note", b.text().trim());
            }
        }
        return m;
    }

    private Map<String, Object> extractPrinting(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        Element sec = section(doc, "งานพิมพ์");
        if (sec == null)
            return m;

        Element hdr = sec.selectFirst("th:has(div.bg-l-yellow)");
        if (hdr != null) {
            var b = hdr.select("div.f-blue");
            m.put("machine", get(b, 0));
            m.put("jobType", get(b, 1));
        }

        // Detail row: printPattern, lay, scheduledDate, confirmedBy
        for (Element th : sec.select("th")) {
            var b = th.select("div.f-blue");
            if (b.size() >= 3) {
                m.put("printPattern", get(b, 0));
                m.put("lay", get(b, 1));
                m.put("scheduledDate", get(b, 2));
                m.put("confirmedBy", get(b, 3));
                break;
            }
        }

        // Note (แถวสุดท้าย)
        var noteRows = sec.select("th:has(div.f-blue)");
        if (!noteRows.isEmpty()) {
            m.put("note", noteRows.last().select("div.f-blue").text().trim());
        }
        return m;
    }

    private Map<String, Object> extractCoating(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        Element sec = section(doc, "งานเคลือบ");
        if (sec == null)
            return m;

        Element hdr = sec.selectFirst("th:has(div.bg-l-yellow)");
        if (hdr != null) {
            var b = hdr.select("div.f-blue");
            m.put("location", get(b, 0));
        }

        // รูปแบบ + กำหนดส่ง: แถวแรกที่มี f-blue >= 2
        for (Element th : sec.select("th")) {
            var b = th.select("div.f-blue");
            if (b.size() >= 2) {
                m.put("coatingPattern", get(b, 0));
                m.put("scheduledDate", get(b, 1));
                break;
            }
        }

        var noteRows = sec.select("th:has(div.f-blue)");
        if (!noteRows.isEmpty()) {
            m.put("note", noteRows.last().select("div.f-blue").text().trim());
        }
        return m;
    }

    private Map<String, Object> extractDieCutting(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        Element sec = section(doc, "งานปั้มพิเศษ/ไดคัท");
        if (sec == null)
            return m;

        Element hdr = sec.selectFirst("th:has(div.bg-l-yellow)");
        if (hdr != null) {
            var b = hdr.select("div.f-blue");
            m.put("location", get(b, 0));
        }

        // แถวข้อมูล: ปั้มเค (0-2) + ปั้มนูน (3-5) + ไดคัท (6-8)
        // โครงสร้าง: type | blockCode | isNew สำหรับแต่ละกลุ่ม
        for (Element th : sec.select("th")) {
            var b = th.select("div.f-blue");
            if (b.size() >= 3) {
                // ปั้มเค
                Map<String, Object> foil = new LinkedHashMap<>();
                foil.put("type", get(b, 0));
                foil.put("blockCode", get(b, 1));
                foil.put("isNew", get(b, 2));
                m.put("foilStamping", foil);

                // ปั้มนูน
                if (b.size() >= 6) {
                    Map<String, Object> embossing = new LinkedHashMap<>();
                    embossing.put("type", get(b, 3));
                    embossing.put("blockCode", get(b, 4));
                    embossing.put("isNew", get(b, 5));
                    m.put("embossing", embossing);
                }

                // ปั้มไดคัท
                if (b.size() >= 9) {
                    Map<String, Object> dieCut = new LinkedHashMap<>();
                    dieCut.put("type", get(b, 6));
                    dieCut.put("blockCode", get(b, 7));
                    dieCut.put("isNew", get(b, 8));
                    m.put("dieCut", dieCut);
                } else if (b.size() >= 7) {
                    // กรณีบางใบงานมีแค่ 7-8 ค่า ให้ดึงสิ่งที่มี
                    Map<String, Object> dieCut = new LinkedHashMap<>();
                    dieCut.put("type", get(b, 6));
                    dieCut.put("blockCode", b.size() > 7 ? get(b, 7) : "");
                    dieCut.put("isNew", b.size() > 8 ? get(b, 8) : "");
                    m.put("dieCut", dieCut);
                }
                break;
            }
        }

        // Deadline row: แถวที่มี f-blue == 3 และค่าทุกตัวเป็นวันที่หรือ "-"
        for (Element th : sec.select("th")) {
            var b = th.select("div.f-blue");
            if (b.size() == 3) {
                // ตรวจว่าเป็น deadline row (มีอย่างน้อย 1 ตัวที่เป็นวันที่ หรือทุกตัวเป็น "-")
                boolean hasDate = b.stream().anyMatch(el -> el.text().contains("/202") || el.text().contains("/256"));
                boolean allDash = b.stream().allMatch(el -> el.text().trim().equals("-") || el.text().trim().isEmpty());
                if (hasDate || allDash) {
                    m.put("foilStampingDeadline", get(b, 0));
                    m.put("embossingDeadline", get(b, 1));
                    m.put("dieCutDeadline", get(b, 2));
                    break;
                }
            }
        }
        return m;
    }

    private Map<String, Object> extractGluing(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        Element sec = section(doc, "งานปะกล่อง");
        if (sec == null)
            return m;

        Element hdr = sec.selectFirst("th:has(div.bg-l-yellow)");
        if (hdr != null) {
            var b = hdr.select("div.f-blue");
            m.put("location", get(b, 0));
        }

        // ต้องการ >= 2 f-blue เพื่อข้ามแถว header (มีแค่ 1 f-blue = location)
        // data row มี: pattern (f-blue[0]) + scheduledDate (f-blue[1])
        for (Element th : sec.select("th")) {
            var b = th.select("div.f-blue");
            if (b.size() >= 2) {
                m.put("pattern", get(b, 0));
                m.put("scheduledDate", get(b, 1));
                break;
            }
        }
        return m;
    }

    private Map<String, Object> extractQcDelivery(Document doc) {
        Map<String, Object> m = new LinkedHashMap<>();
        Element sec = section(doc, "งานคิวซี/จัดส่ง");
        if (sec == null)
            return m;

        Element hdr = sec.selectFirst("th:has(div.bg-l-yellow)");
        if (hdr != null) {
            var b = hdr.select("div.f-blue");
            m.put("requiredQty", get(b, 0));
            m.put("qa", get(b, 1));
        }

        // QC detail row: header th มี 2 f-blue (requiredQty, qa), data th มี >= 3
        // f-blue
        // detail = ความละเอียดงาน QC, bookletST = เล่มST, scheduledDate = กำหนดส่ง
        for (Element th : sec.select("th")) {
            var b = th.select("div.f-blue");
            if (b.size() >= 3) {
                m.put("detail", get(b, 0));
                m.put("bookletST", get(b, 1));
                m.put("scheduledDate", get(b, 2));
                break;
            }
        }

        String note = getBlueText(sec, "หมายเหตุ");
        if (note != null && !note.isEmpty()) {
            m.put("note", note);
        } else {
            // Note: แถวที่ค่าแรกเป็นวันที่ (เช่น 13/03/2026 ...) (Fallback)
            for (Element th : sec.select("th:has(div.f-blue)")) {
                var b = th.select("div.f-blue");
                String first = b.isEmpty() ? "" : b.get(0).text().trim();
                if (first.contains("/202") || first.contains("/256")) {
                    m.put("note", first);
                    break;
                }
            }
        }

        // สถานที่จัดส่ง
        Element locRow = sec.selectFirst("th:has(div.bg-l-yellow:contains(สถานที่จัดส่ง))");
        if (locRow != null) {
            m.put("deliveryLocation", locRow.select("div.f-blue").text().trim());
        }

        // รูปแบบ + วันเวลาจัดส่ง
        Element dtRow = sec.selectFirst("th:has(div.bg-l-red:contains(วันเวลาจัดส่ง))");
        if (dtRow != null) {
            var b = dtRow.select("div.f-blue");
            m.put("deliveryPattern", get(b, 0));
            m.put("deliveryDateTime", get(b, 1));
        }
        return m;
    }

    /* ===================== HELPERS ===================== */

    /**
     * หา table section จาก title ใน div.bg-l-yellow — ใช้ contains แทน matchesOwn
     * เพื่อรองรับ
     * ตัวอักขระเกิน เช่น trailing apostrophe ใน "งานคิวซี/จัดส่ง'"
     */
    private Element section(Document doc, String title) {
        if (doc == null)
            return null;
        return doc.selectFirst("table:has(div.bg-l-yellow:contains(" + title + "))");
    }

    /** ดึง div.f-blue ตัวที่ index จาก scope */
    private String blueAt(Element sec, int index) {
        if (sec == null)
            return "";
        var blues = sec.select("div.f-blue");
        return blues.size() > index ? blues.get(index).text().trim() : "";
    }

    /** ดึง th แถวที่ n จาก section */
    private Element nthRow(Element sec, int n) {
        if (sec == null)
            return null;
        var rows = sec.select("th");
        return rows.size() > n ? rows.get(n) : null;
    }

    /** ดึง text จาก Elements ตาม index (null-safe) */
    private String get(org.jsoup.select.Elements els, int index) {
        return els.size() > index ? els.get(index).text().trim() : "";
    }

    /** ดึง text ถัดจาก label ที่ระบุใน scope */
    private String getBlueText(Element scope, String label) {
        if (scope == null)
            return "";
        Element target = scope.selectFirst("div:matchesOwn(^\\s*" + label + "\\s*$)");
        if (target != null) {
            Element next = target.nextElementSibling();
            return next != null ? next.text().replace("\u00A0", "").trim() : "";
        }
        return "";
    }

    /** ตัดเอาเฉพาะตัวเลขและ comma */
    private String extractNumbers(String text) {
        if (text == null || text.isEmpty())
            return "";
        return text.replaceAll("[^0-9,]", "").trim();
    }
}
