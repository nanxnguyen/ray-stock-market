# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> AG Grid Table Visual Regression >> AG Grid priceboard scrolls horizontally on small screens
- Location: tests/visual/homepage.spec.ts:158:3

# Error details

```
Error: expect(received).toMatchObject(expected)

- Expected  - 1
+ Received  + 1

  Object {
    "hasOverflow": true,
    "hasShell": true,
    "moved": true,
    "scrollbarInViewport": true,
-   "watchlistVisibleAfterScroll": true,
+   "watchlistVisibleAfterScroll": false,
  }
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - link "Ray Stock Market" [ref=e6] [cursor=pointer]:
      - /url: /
      - img [ref=e8]
      - generic [ref=e10]: Ray Stock Market
    - generic [ref=e11]: 05/07/2026 18:56:32
    - generic [ref=e12]:
      - text: VN-Index
      - generic [ref=e13]: ▲1,860.01 +5.04
      - text: │VN30
      - generic [ref=e14]: ▲1,995.71 +5.06
      - text: │ACB
      - generic [ref=e15]: ▼22.65 -0.25
      - text: │HPG
      - generic [ref=e16]: ▲24.10 +0.32
      - text: │VCB
      - generic [ref=e17]: ▲81.50 +1.13
      - text: │FPT
      - generic [ref=e18]: ▲137.50 +1.89
      - text: │DOW
      - generic [ref=e19]: ▲52,342 +0.31%
    - generic [ref=e20]:
      - link "💼 Danh mục" [ref=e21] [cursor=pointer]:
        - /url: /portfolio
      - link "💰 Đặt lệnh" [ref=e22] [cursor=pointer]:
        - /url: /trading-panel
      - link "📖 Sổ lệnh" [ref=e23] [cursor=pointer]:
        - /url: /order-book
      - generic [ref=e24] [cursor=pointer]:
        - text: Công cụ
        - generic [ref=e30]: ▾
      - generic "Chuyển Light mode" [ref=e32] [cursor=pointer]:
        - generic [ref=e33]: ☀
        - generic [ref=e34]: LIGHT
  - generic [ref=e36]:
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39] [cursor=pointer]:
          - generic [ref=e41]:
            - generic [ref=e42]: VN-Index
            - generic [ref=e43]: LIVE
          - generic [ref=e44]: 1,860.01
          - generic [ref=e45]: +5.04 (+0.27%)
          - generic [ref=e46]: "KL: 692,765,051"
          - generic [ref=e47]:
            - generic [ref=e48]: ▲146
            - generic [ref=e49]: ▼74
            - generic [ref=e50]: ──148
          - img [ref=e51]
        - generic [ref=e54] [cursor=pointer]:
          - generic [ref=e56]:
            - generic [ref=e57]: VN30-Index
            - generic [ref=e58]: LIVE
          - generic [ref=e59]: 1,995.71
          - generic [ref=e60]: +5.06 (+0.25%)
          - generic [ref=e61]: "KL: 312,451,165"
          - generic [ref=e62]:
            - generic [ref=e63]: ▲14
            - generic [ref=e64]: ▼2
            - generic [ref=e65]: ──14
          - img [ref=e66]
        - generic [ref=e69] [cursor=pointer]:
          - generic [ref=e71]:
            - generic [ref=e72]: HNX-Index
            - generic [ref=e73]: LIVE
          - generic [ref=e74]: "313.16"
          - generic [ref=e75]: "-8.58 (-0.43%)"
          - generic [ref=e76]: "KL: 41,602,865"
          - generic [ref=e77]:
            - generic [ref=e78]: ▲61
            - generic [ref=e79]: ▼68
            - generic [ref=e80]: ──63
          - img [ref=e81]
        - generic [ref=e84] [cursor=pointer]:
          - generic [ref=e86]:
            - generic [ref=e87]: HNX30
            - generic [ref=e88]: LIVE
          - generic [ref=e89]: "513.44"
          - generic [ref=e90]: +0.14 (+0.03%)
          - generic [ref=e91]: "KL: 26,266,277"
          - generic [ref=e92]:
            - generic [ref=e93]: ▲15
            - generic [ref=e94]: ▼6
            - generic [ref=e95]: ──9
          - img [ref=e96]
        - generic [ref=e99] [cursor=pointer]:
          - generic [ref=e101]:
            - generic [ref=e102]: UPCOM
            - generic [ref=e103]: LIVE
          - generic [ref=e104]: "129.94"
          - generic [ref=e105]: +0.62 (+0.48%)
          - generic [ref=e106]: "KL: 21,599,770"
          - generic [ref=e107]:
            - generic [ref=e108]: ▲121
            - generic [ref=e109]: ▼90
            - generic [ref=e110]: ──81
          - img [ref=e111]
      - generic [ref=e114]:
        - generic [ref=e115]:
          - generic [ref=e116] [cursor=pointer]: Mỹ
          - generic [ref=e117] [cursor=pointer]: Châu Âu
          - generic [ref=e118] [cursor=pointer]: Châu Á
          - generic [ref=e119] [cursor=pointer]: Hàng hoá
        - generic [ref=e120]:
          - generic [ref=e121]:
            - generic [ref=e122]: Dow Jones
            - generic [ref=e123]: 42,587.50
          - generic [ref=e124]:
            - generic [ref=e125]: "+132.45"
            - generic [ref=e126]: +0.31%
        - generic [ref=e127]:
          - generic [ref=e128]:
            - generic [ref=e129]: S&P 500
            - generic [ref=e130]: 5,862.13
          - generic [ref=e131]:
            - generic [ref=e132]: "+14.62"
            - generic [ref=e133]: +0.25%
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]: Nasdaq
            - generic [ref=e137]: 19,169.95
          - generic [ref=e138]:
            - generic [ref=e139]: "+256.34"
            - generic [ref=e140]: +1.35%
        - generic [ref=e141]:
          - generic [ref=e142]:
            - generic [ref=e143]: Russell 2000
            - generic [ref=e144]: 2,026.97
          - generic [ref=e145]:
            - generic [ref=e146]: "+11.15"
            - generic [ref=e147]: +0.55%
        - generic [ref=e148]:
          - generic [ref=e149]:
            - generic [ref=e150]: VIX
            - generic [ref=e151]: "14.82"
          - generic [ref=e152]:
            - generic [ref=e153]: "-0.34"
            - generic [ref=e154]: "-2.24%"
    - generic [ref=e156]:
      - generic [ref=e157]:
        - button "☰" [ref=e158]
        - button "⊞" [ref=e159]
        - button "▦" [ref=e160]
        - button "📊" [ref=e161]
      - generic [ref=e163]:
        - generic [ref=e164]: 🔍
        - textbox "Thêm mã ..." [ref=e165]
      - separator [ref=e166]
      - generic [ref=e167]:
        - button "Danh mục quan tâm" [ref=e168]
        - button "HOSE ▾" [ref=e169] [cursor=pointer]:
          - text: HOSE
          - generic [ref=e170]: ▾
        - button "HNX ▾" [ref=e171] [cursor=pointer]:
          - text: HNX
          - generic [ref=e172]: ▾
        - button "UPCOM ▾" [ref=e173] [cursor=pointer]:
          - text: UPCOM
          - generic [ref=e174]: ▾
        - button "Phái Sinh ▾" [ref=e175] [cursor=pointer]:
          - text: Phái Sinh
          - generic [ref=e176]: ▾
        - button "Chứng Quyền" [ref=e177]
        - button "Ngành ▾" [ref=e178] [cursor=pointer]:
          - text: Ngành
          - generic [ref=e179]: ▾
        - button "Trái phiếu ▾" [ref=e180] [cursor=pointer]:
          - text: Trái phiếu
          - generic [ref=e181]: ▾
      - generic [ref=e182]:
        - button "🔍" [ref=e183]
        - button "📋" [ref=e184]
        - button "⬇" [ref=e185]
    - generic [ref=e189]:
      - treegrid [ref=e191]:
        - rowgroup [ref=e192]:
          - row [ref=e193]:        
          - row "Mã CK Trần TC Sàn" [ref=e194]:
            - columnheader "Mã CK" [ref=e195]:
              - text: 
              - generic [ref=e197] [cursor=pointer]: Mã CK
              - text:     
            - columnheader "Trần" [ref=e198]:
              - text: 
              - generic [ref=e200] [cursor=pointer]: Trần
              - text:     
            - columnheader "TC" [ref=e201]:
              - text: 
              - generic [ref=e203] [cursor=pointer]: TC
              - text:     
            - columnheader "Sàn" [ref=e204]:
              - text: 
              - generic [ref=e206] [cursor=pointer]: Sàn
              - text:     
        - rowgroup [ref=e207]:
          - row "── DƯ MUA ── KHỚP LỆNH ── DƯ BÁN ── NN" [ref=e208]:
            - columnheader "── DƯ MUA ──" [ref=e209]: ── DƯ MUA ──  
            - columnheader "KHỚP LỆNH" [ref=e211]: KHỚP LỆNH  
            - columnheader "── DƯ BÁN ──" [ref=e213]: ── DƯ BÁN ──  
            - text:      
            - columnheader "NN" [ref=e215]: NN  
            - text:    
          - row "Giá 3 KL 3 Giá 2 KL 2 Giá 1 KL 1 Giá KL % ↕ KLGD Giá 1 KL 1 Giá 2 KL 2 Giá 3 KL 3 Cao TB Thấp Mua Bán ↕ Room KLGD TT ♡" [ref=e217]:
            - columnheader "Giá 3" [ref=e218]:
              - text: 
              - generic [ref=e220] [cursor=pointer]: Giá 3
              - text:     
            - columnheader "KL 3" [ref=e221]:
              - text: 
              - generic [ref=e223] [cursor=pointer]: KL 3
              - text:     
            - columnheader "Giá 2" [ref=e224]:
              - text: 
              - generic [ref=e226] [cursor=pointer]: Giá 2
              - text:     
            - columnheader "KL 2" [ref=e227]:
              - text: 
              - generic [ref=e229] [cursor=pointer]: KL 2
              - text:     
            - columnheader "Giá 1" [ref=e230]:
              - text: 
              - generic [ref=e232] [cursor=pointer]: Giá 1
              - text:     
            - columnheader "KL 1" [ref=e233]:
              - text: 
              - generic [ref=e235] [cursor=pointer]: KL 1
              - text:     
            - columnheader "Giá" [ref=e236]:
              - text: 
              - generic [ref=e238] [cursor=pointer]: Giá
              - text:     
            - columnheader "KL" [ref=e239]:
              - text: 
              - generic [ref=e241] [cursor=pointer]: KL
              - text:     
            - columnheader "%" [ref=e242]:
              - text: 
              - generic [ref=e244] [cursor=pointer]: "%"
              - text:     
            - columnheader "↕" [ref=e245]:
              - text: 
              - generic [ref=e247] [cursor=pointer]: ↕
              - text:     
            - columnheader "KLGD" [ref=e248]:
              - text: 
              - generic [ref=e250] [cursor=pointer]: KLGD
              - text:     
            - columnheader "Giá 1" [ref=e251]:
              - text: 
              - generic [ref=e253] [cursor=pointer]: Giá 1
              - text:     
            - columnheader "KL 1" [ref=e254]:
              - text: 
              - generic [ref=e256] [cursor=pointer]: KL 1
              - text:     
            - columnheader "Giá 2" [ref=e257]:
              - text: 
              - generic [ref=e259] [cursor=pointer]: Giá 2
              - text:     
            - columnheader "KL 2" [ref=e260]:
              - text: 
              - generic [ref=e262] [cursor=pointer]: KL 2
              - text:     
            - columnheader "Giá 3" [ref=e263]:
              - text: 
              - generic [ref=e265] [cursor=pointer]: Giá 3
              - text:     
            - columnheader "KL 3" [ref=e266]:
              - text: 
              - generic [ref=e268] [cursor=pointer]: KL 3
              - text:     
            - columnheader "Cao" [ref=e269]:
              - text: 
              - generic [ref=e271] [cursor=pointer]: Cao
              - text:     
            - columnheader "TB" [ref=e272]:
              - text: 
              - generic [ref=e274] [cursor=pointer]: TB
              - text:     
            - columnheader "Thấp" [ref=e275]:
              - text: 
              - generic [ref=e277] [cursor=pointer]: Thấp
              - text:     
            - columnheader "Mua" [ref=e278]:
              - text: 
              - generic [ref=e280] [cursor=pointer]: Mua
              - text:     
            - columnheader "Bán" [ref=e281]:
              - text: 
              - generic [ref=e283] [cursor=pointer]: Bán
              - text:     
            - columnheader "↕" [ref=e284]:
              - text: 
              - generic [ref=e286] [cursor=pointer]: ↕
              - text:     
            - columnheader "Room" [ref=e287]:
              - text: 
              - generic [ref=e289] [cursor=pointer]: Room
              - text:     
            - columnheader "KLGD TT" [ref=e290]:
              - text: 
              - generic [ref=e292] [cursor=pointer]: KLGD TT
              - text:     
            - columnheader "♡" [ref=e293]:
              - text: 
              - generic [ref=e295] [cursor=pointer]: ♡
              - text:     
        - rowgroup [ref=e296]:
          - row "VN30F1M 21.50 20.10 18.69" [ref=e297]:
            - gridcell "VN30F1M" [ref=e298] [cursor=pointer]
            - gridcell "21.50" [ref=e299]
            - gridcell "20.10" [ref=e300]
            - gridcell "18.69" [ref=e301]
          - row "VN30F1M 21.53 20.12 18.71" [ref=e302]:
            - gridcell "VN30F1M" [ref=e303] [cursor=pointer]
            - gridcell "21.53" [ref=e304]
            - gridcell "20.12" [ref=e305]
            - gridcell "18.71" [ref=e306]
          - row "VN30F1M 21.53 20.12 18.71" [ref=e307]:
            - gridcell "VN30F1M" [ref=e308] [cursor=pointer]
            - gridcell "21.53" [ref=e309]
            - gridcell "20.12" [ref=e310]
            - gridcell "18.71" [ref=e311]
          - row "VN30F1M 21.52 20.11 18.70" [ref=e312]:
            - gridcell "VN30F1M" [ref=e313] [cursor=pointer]
            - gridcell "21.52" [ref=e314]
            - gridcell "20.11" [ref=e315]
            - gridcell "18.70" [ref=e316]
          - row "VN30F2M 20.78 19.42 18.07" [ref=e317]:
            - gridcell "VN30F2M" [ref=e318] [cursor=pointer]
            - gridcell "20.78" [ref=e319]
            - gridcell "19.42" [ref=e320]
            - gridcell "18.07" [ref=e321]
          - row "VN30F2M 20.78 19.42 18.06" [ref=e322]:
            - gridcell "VN30F2M" [ref=e323] [cursor=pointer]
            - gridcell "20.78" [ref=e324]
            - gridcell "19.42" [ref=e325]
            - gridcell "18.06" [ref=e326]
          - row "VN30F2M 20.75 19.39 18.03" [ref=e327]:
            - gridcell "VN30F2M" [ref=e328] [cursor=pointer]
            - gridcell "20.75" [ref=e329]
            - gridcell "19.39" [ref=e330]
            - gridcell "18.03" [ref=e331]
          - row "VN30F2M 20.72 19.36 18.01" [ref=e332]:
            - gridcell "VN30F2M" [ref=e333] [cursor=pointer]
            - gridcell "20.72" [ref=e334]
            - gridcell "19.36" [ref=e335]
            - gridcell "18.01" [ref=e336]
          - row "A32 0.34 0.29 0.25" [ref=e337]:
            - gridcell "A32" [ref=e338] [cursor=pointer]
            - gridcell "0.34" [ref=e339]
            - gridcell "0.29" [ref=e340]
            - gridcell "0.25" [ref=e341]
          - row "AAA 0.08 0.07 0.07" [ref=e342]:
            - gridcell "AAA" [ref=e343] [cursor=pointer]
            - gridcell "0.08" [ref=e344]
            - gridcell "0.07" [ref=e345]
            - gridcell "0.07" [ref=e346]
          - row "AAH 0.03 0.03 0.02" [ref=e347]:
            - gridcell "AAH" [ref=e348] [cursor=pointer]
            - gridcell "0.03" [ref=e349]
            - gridcell "0.03" [ref=e350]
            - gridcell "0.02" [ref=e351]
          - row "AAM 0.07 0.07 0.06" [ref=e352]:
            - gridcell "AAM" [ref=e353] [cursor=pointer]
            - gridcell "0.07" [ref=e354]
            - gridcell "0.07" [ref=e355]
            - gridcell "0.06" [ref=e356]
          - row "AAN 0.17 0.16 0.15" [ref=e357]:
            - gridcell "AAN" [ref=e358] [cursor=pointer]
            - gridcell "0.17" [ref=e359]
            - gridcell "0.16" [ref=e360]
            - gridcell "0.15" [ref=e361]
          - row "AAS 0.10 0.09 0.07" [ref=e362]:
            - gridcell "AAS" [ref=e363] [cursor=pointer]
            - gridcell "0.10" [ref=e364]
            - gridcell "0.09" [ref=e365]
            - gridcell "0.07" [ref=e366]
          - row "AAT 0.03 0.03 0.03" [ref=e367]:
            - gridcell "AAT" [ref=e368] [cursor=pointer]
            - gridcell "0.03" [ref=e369]
            - gridcell "0.03" [ref=e370]
            - gridcell "0.03" [ref=e371]
          - row "AAV 0.08 0.07 0.06" [ref=e372]:
            - gridcell "AAV" [ref=e373] [cursor=pointer]
            - gridcell "0.08" [ref=e374]
            - gridcell "0.07" [ref=e375]
            - gridcell "0.06" [ref=e376]
          - row "ABB 0.21 0.18 0.16" [ref=e377]:
            - gridcell "ABB" [ref=e378] [cursor=pointer]
            - gridcell "0.21" [ref=e379]
            - gridcell "0.18" [ref=e380]
            - gridcell "0.16" [ref=e381]
          - row "ABC 0.12 0.10 0.09" [ref=e382]:
            - gridcell "ABC" [ref=e383] [cursor=pointer]
            - gridcell "0.12" [ref=e384]
            - gridcell "0.10" [ref=e385]
            - gridcell "0.09" [ref=e386]
          - row "ABI 0.22 0.19 0.17" [ref=e387]:
            - gridcell "ABI" [ref=e388] [cursor=pointer]
            - gridcell "0.22" [ref=e389]
            - gridcell "0.19" [ref=e390]
            - gridcell "0.17" [ref=e391]
          - row "ABR 0.12 0.12 0.11" [ref=e392]:
            - gridcell "ABR" [ref=e393] [cursor=pointer]
            - gridcell "0.12" [ref=e394]
            - gridcell "0.12" [ref=e395]
            - gridcell "0.11" [ref=e396]
          - row "ABS 0.03 0.03 0.03" [ref=e397]:
            - gridcell "ABS" [ref=e398] [cursor=pointer]
            - gridcell "0.03" [ref=e399]
            - gridcell "0.03" [ref=e400]
            - gridcell "0.03" [ref=e401]
          - row "ABT 0.58 0.54 0.50" [ref=e402]:
            - gridcell "ABT" [ref=e403] [cursor=pointer]
            - gridcell "0.58" [ref=e404]
            - gridcell "0.54" [ref=e405]
            - gridcell "0.50" [ref=e406]
          - row "ABW 0.15 0.13 0.11" [ref=e407]:
            - gridcell "ABW" [ref=e408] [cursor=pointer]
            - gridcell "0.15" [ref=e409]
            - gridcell "0.13" [ref=e410]
            - gridcell "0.11" [ref=e411]
          - row "ACB 0.24 0.23 0.21" [ref=e412]:
            - gridcell "ACB" [ref=e413] [cursor=pointer]
            - gridcell "0.24" [ref=e414]
            - gridcell "0.23" [ref=e415]
            - gridcell "0.21" [ref=e416]
          - row "ACC 0.12 0.11 0.11" [ref=e417]:
            - gridcell "ACC" [ref=e418] [cursor=pointer]
            - gridcell "0.12" [ref=e419]
            - gridcell "0.11" [ref=e420]
            - gridcell "0.11" [ref=e421]
          - row "ACE 0.41 0.36 0.30" [ref=e422]:
            - gridcell "ACE" [ref=e423] [cursor=pointer]
            - gridcell "0.41" [ref=e424]
            - gridcell "0.36" [ref=e425]
            - gridcell "0.30" [ref=e426]
        - rowgroup [ref=e427]:
          - row "20.09 24 20.09 7 20.09 7 20.09 4,869 +0.0% -0.01 147,578 20.09 3 20.09 34 20.09 33 20.16 20.09 20.01 7,233 6,959 +274 147,578 ♡" [ref=e428]:
            - gridcell "20.09" [ref=e429]
            - gridcell "24" [ref=e430]
            - gridcell "20.09" [ref=e431]
            - gridcell "7" [ref=e432]
            - gridcell "20.09" [ref=e433]
            - gridcell "7" [ref=e434]
            - gridcell "20.09" [ref=e435]
            - gridcell "4,869" [ref=e436]
            - gridcell "+0.0%" [ref=e437]
            - gridcell "-0.01" [ref=e438]
            - gridcell "147,578" [ref=e439]
            - gridcell "20.09" [ref=e440]
            - gridcell "3" [ref=e441]
            - gridcell "20.09" [ref=e442]
            - gridcell "34" [ref=e443]
            - gridcell "20.09" [ref=e444]
            - gridcell "33" [ref=e445]
            - gridcell "20.16" [ref=e446]
            - gridcell "20.09" [ref=e447]
            - gridcell "20.01" [ref=e448]
            - gridcell "7,233" [ref=e449]
            - gridcell "6,959" [ref=e450]
            - gridcell "+274" [ref=e451]
            - gridcell [ref=e452]
            - gridcell "147,578" [ref=e453]
            - gridcell "♡" [ref=e454] [cursor=pointer]
          - row "20.04 1 20.05 3 20.01 17,000 20.06 4,600 -0.3% -0.06 4,946 20.11 1,800 20.12 2 20.13 2 20.15 20.07 20.01 141 2 +139 4,946 ♡" [ref=e455]:
            - gridcell "20.04" [ref=e456]
            - gridcell "1" [ref=e457]
            - gridcell "20.05" [ref=e458]
            - gridcell "3" [ref=e459]
            - gridcell "20.01" [ref=e460]
            - gridcell "17,000" [ref=e461]
            - gridcell "20.06" [ref=e462]
            - gridcell "4,600" [ref=e463]
            - gridcell "-0.3%" [ref=e464]
            - gridcell "-0.06" [ref=e465]
            - gridcell "4,946" [ref=e466]
            - gridcell "20.11" [ref=e467]
            - gridcell "1,800" [ref=e468]
            - gridcell "20.12" [ref=e469]
            - gridcell "2" [ref=e470]
            - gridcell "20.13" [ref=e471]
            - gridcell "2" [ref=e472]
            - gridcell "20.15" [ref=e473]
            - gridcell "20.07" [ref=e474]
            - gridcell "20.01" [ref=e475]
            - gridcell "141" [ref=e476]
            - gridcell "2" [ref=e477]
            - gridcell "+139" [ref=e478]
            - gridcell [ref=e479]
            - gridcell "4,946" [ref=e480]
            - gridcell "♡" [ref=e481] [cursor=pointer]
          - row "20.04 1 20.05 1 20.11 23,000 20.16 4,600 +0.2% +0.04 4,732 20.21 18,400 20.12 1 20.12 1 20.16 20.11 20.02 7 40 33 4,732 ♡" [ref=e482]:
            - gridcell "20.04" [ref=e483]
            - gridcell "1" [ref=e484]
            - gridcell "20.05" [ref=e485]
            - gridcell "1" [ref=e486]
            - gridcell "20.11" [ref=e487]
            - gridcell "23,000" [ref=e488]
            - gridcell "20.16" [ref=e489]
            - gridcell "4,600" [ref=e490]
            - gridcell "+0.2%" [ref=e491]
            - gridcell "+0.04" [ref=e492]
            - gridcell "4,732" [ref=e493]
            - gridcell "20.21" [ref=e494]
            - gridcell "18,400" [ref=e495]
            - gridcell "20.12" [ref=e496]
            - gridcell "1" [ref=e497]
            - gridcell "20.12" [ref=e498]
            - gridcell "1" [ref=e499]
            - gridcell "20.16" [ref=e500]
            - gridcell "20.11" [ref=e501]
            - gridcell "20.02" [ref=e502]
            - gridcell "7" [ref=e503]
            - gridcell "40" [ref=e504]
            - gridcell "33" [ref=e505]
            - gridcell [ref=e506]
            - gridcell "4,732" [ref=e507]
            - gridcell "♡" [ref=e508] [cursor=pointer]
          - row "20.04 1 20.05 1 20.05 1 20.05 3 -0.3% -0.06 99 20.11 1 20.12 1 20.13 3 20.14 20.07 20.02 1 49 48 99 ♡" [ref=e509]:
            - gridcell "20.04" [ref=e510]
            - gridcell "1" [ref=e511]
            - gridcell "20.05" [ref=e512]
            - gridcell "1" [ref=e513]
            - gridcell "20.05" [ref=e514]
            - gridcell "1" [ref=e515]
            - gridcell "20.05" [ref=e516]
            - gridcell "3" [ref=e517]
            - gridcell "-0.3%" [ref=e518]
            - gridcell "-0.06" [ref=e519]
            - gridcell "99" [ref=e520]
            - gridcell "20.11" [ref=e521]
            - gridcell "1" [ref=e522]
            - gridcell "20.12" [ref=e523]
            - gridcell "1" [ref=e524]
            - gridcell "20.13" [ref=e525]
            - gridcell "3" [ref=e526]
            - gridcell "20.14" [ref=e527]
            - gridcell "20.07" [ref=e528]
            - gridcell "20.02" [ref=e529]
            - gridcell "1" [ref=e530]
            - gridcell "49" [ref=e531]
            - gridcell "48" [ref=e532]
            - gridcell [ref=e533]
            - gridcell "99" [ref=e534]
            - gridcell "♡" [ref=e535] [cursor=pointer]
          - row "19.30 1 19.33 1 19.36 1 19.39 1 -0.2% -0.03 20 19.43 1 19.43 1 19.46 1 19.43 19.37 19.30 20 ♡" [ref=e536]:
            - gridcell "19.30" [ref=e537]
            - gridcell "1" [ref=e538]
            - gridcell "19.33" [ref=e539]
            - gridcell "1" [ref=e540]
            - gridcell "19.36" [ref=e541]
            - gridcell "1" [ref=e542]
            - gridcell "19.39" [ref=e543]
            - gridcell "1" [ref=e544]
            - gridcell "-0.2%" [ref=e545]
            - gridcell "-0.03" [ref=e546]
            - gridcell "20" [ref=e547]
            - gridcell "19.43" [ref=e548]
            - gridcell "1" [ref=e549]
            - gridcell "19.43" [ref=e550]
            - gridcell "1" [ref=e551]
            - gridcell "19.46" [ref=e552]
            - gridcell "1" [ref=e553]
            - gridcell "19.43" [ref=e554]
            - gridcell "19.37" [ref=e555]
            - gridcell "19.30" [ref=e556]
            - gridcell [ref=e557]
            - gridcell [ref=e558]
            - gridcell [ref=e559]
            - gridcell [ref=e560]
            - gridcell "20" [ref=e561]
            - gridcell "♡" [ref=e562] [cursor=pointer]
          - row "19.15 1 19.26 1 19.27 1 19.38 1 -0.2% -0.04 1 19.49 1 19.49 1 19.50 2 19.38 19.38 19.38 1 ♡" [ref=e563]:
            - gridcell "19.15" [ref=e564]
            - gridcell "1" [ref=e565]
            - gridcell "19.26" [ref=e566]
            - gridcell "1" [ref=e567]
            - gridcell "19.27" [ref=e568]
            - gridcell "1" [ref=e569]
            - gridcell "19.38" [ref=e570]
            - gridcell "1" [ref=e571]
            - gridcell "-0.2%" [ref=e572]
            - gridcell "-0.04" [ref=e573]
            - gridcell "1" [ref=e574]
            - gridcell "19.49" [ref=e575]
            - gridcell "1" [ref=e576]
            - gridcell "19.49" [ref=e577]
            - gridcell "1" [ref=e578]
            - gridcell "19.50" [ref=e579]
            - gridcell "2" [ref=e580]
            - gridcell "19.38" [ref=e581]
            - gridcell "19.38" [ref=e582]
            - gridcell "19.38" [ref=e583]
            - gridcell [ref=e584]
            - gridcell [ref=e585]
            - gridcell [ref=e586]
            - gridcell [ref=e587]
            - gridcell "1" [ref=e588]
            - gridcell "♡" [ref=e589] [cursor=pointer]
          - row "19.16 1 19.22 1 19.26 37,200 19.31 2,400 -0.4% -0.08 2,404 19.36 6,800 19.36 1 19.37 1 19.36 19.29 19.21 2,404 ♡" [ref=e590]:
            - gridcell "19.16" [ref=e591]
            - gridcell "1" [ref=e592]
            - gridcell "19.22" [ref=e593]
            - gridcell "1" [ref=e594]
            - gridcell "19.26" [ref=e595]
            - gridcell "37,200" [ref=e596]
            - gridcell "19.31" [ref=e597]
            - gridcell "2,400" [ref=e598]
            - gridcell "-0.4%" [ref=e599]
            - gridcell "-0.08" [ref=e600]
            - gridcell "2,404" [ref=e601]
            - gridcell "19.36" [ref=e602]
            - gridcell "6,800" [ref=e603]
            - gridcell "19.36" [ref=e604]
            - gridcell "1" [ref=e605]
            - gridcell "19.37" [ref=e606]
            - gridcell "1" [ref=e607]
            - gridcell "19.36" [ref=e608]
            - gridcell "19.29" [ref=e609]
            - gridcell "19.21" [ref=e610]
            - gridcell [ref=e611]
            - gridcell [ref=e612]
            - gridcell [ref=e613]
            - gridcell [ref=e614]
            - gridcell "2,404" [ref=e615]
            - gridcell "♡" [ref=e616] [cursor=pointer]
          - row "18.80 1 19.01 1 18.01 25,400 18.01 7,500 -7.0% -1.35 7,500 18.06 21,200 19.55 1 19.60 1 18.01 12.01 0.00 7,500 ♡" [ref=e617]:
            - gridcell "18.80" [ref=e618]
            - gridcell "1" [ref=e619]
            - gridcell "19.01" [ref=e620]
            - gridcell "1" [ref=e621]
            - gridcell "18.01" [ref=e622]
            - gridcell "25,400" [ref=e623]
            - gridcell "18.01" [ref=e624]
            - gridcell "7,500" [ref=e625]
            - gridcell "-7.0%" [ref=e626]
            - gridcell "-1.35" [ref=e627]
            - gridcell "7,500" [ref=e628]
            - gridcell "18.06" [ref=e629]
            - gridcell "21,200" [ref=e630]
            - gridcell "19.55" [ref=e631]
            - gridcell "1" [ref=e632]
            - gridcell "19.60" [ref=e633]
            - gridcell "1" [ref=e634]
            - gridcell "18.01" [ref=e635]
            - gridcell "12.01" [ref=e636]
            - gridcell "0.00" [ref=e637]
            - gridcell [ref=e638]
            - gridcell [ref=e639]
            - gridcell [ref=e640]
            - gridcell [ref=e641]
            - gridcell "7,500" [ref=e642]
            - gridcell "♡" [ref=e643] [cursor=pointer]
          - row "0.28 100 0.28 100 0.25 29,000 0.25 7,400 -13.8% -0.04 7,400 0.26 15,200 0.31 100 0.31 100 0.25 0.17 0.00 7,400 ♡" [ref=e644]:
            - gridcell "0.28" [ref=e645]
            - gridcell "100" [ref=e646]
            - gridcell "0.28" [ref=e647]
            - gridcell "100" [ref=e648]
            - gridcell "0.25" [ref=e649]
            - gridcell "29,000" [ref=e650]
            - gridcell "0.25" [ref=e651]
            - gridcell "7,400" [ref=e652]
            - gridcell "-13.8%" [ref=e653]
            - gridcell "-0.04" [ref=e654]
            - gridcell "7,400" [ref=e655]
            - gridcell "0.26" [ref=e656]
            - gridcell "15,200" [ref=e657]
            - gridcell "0.31" [ref=e658]
            - gridcell "100" [ref=e659]
            - gridcell "0.31" [ref=e660]
            - gridcell "100" [ref=e661]
            - gridcell "0.25" [ref=e662]
            - gridcell "0.17" [ref=e663]
            - gridcell "0.00" [ref=e664]
            - gridcell [ref=e665]
            - gridcell [ref=e666]
            - gridcell [ref=e667]
            - gridcell [ref=e668]
            - gridcell "7,400" [ref=e669]
            - gridcell "♡" [ref=e670] [cursor=pointer]
          - row "0.07 7,800 0.07 12,200 0.07 26,400 0.08 9,300 +14.3% +0.01 723,300 0.08 7,800 0.07 15,200 0.07 3,200 0.08 0.08 0.07 94,100 23,200 +70,900 723,300 ♡" [ref=e671]:
            - gridcell "0.07" [ref=e672]
            - gridcell "7,800" [ref=e673]
            - gridcell "0.07" [ref=e674]
            - gridcell "12,200" [ref=e675]
            - gridcell "0.07" [ref=e676]
            - gridcell "26,400" [ref=e677]
            - gridcell "0.08" [ref=e678]
            - gridcell "9,300" [ref=e679]
            - gridcell "+14.3%" [ref=e680]
            - gridcell "+0.01" [ref=e681]
            - gridcell "723,300" [ref=e682]
            - gridcell "0.08" [ref=e683]
            - gridcell "7,800" [ref=e684]
            - gridcell "0.07" [ref=e685]
            - gridcell "15,200" [ref=e686]
            - gridcell "0.07" [ref=e687]
            - gridcell "3,200" [ref=e688]
            - gridcell "0.08" [ref=e689]
            - gridcell "0.08" [ref=e690]
            - gridcell "0.07" [ref=e691]
            - gridcell "94,100" [ref=e692]
            - gridcell "23,200" [ref=e693]
            - gridcell "+70,900" [ref=e694]
            - gridcell [ref=e695]
            - gridcell "723,300" [ref=e696]
            - gridcell "♡" [ref=e697] [cursor=pointer]
          - row "0.02 63,500 0.02 192,300 0.03 2,700 0.03 200 +0.0% +0.00 616,100 0.03 253,200 0.03 343,300 0.03 303,500 0.03 0.03 0.02 616,100 ♡" [ref=e698]:
            - gridcell "0.02" [ref=e699]
            - gridcell "63,500" [ref=e700]
            - gridcell "0.02" [ref=e701]
            - gridcell "192,300" [ref=e702]
            - gridcell "0.03" [ref=e703]
            - gridcell "2,700" [ref=e704]
            - gridcell "0.03" [ref=e705]
            - gridcell "200" [ref=e706]
            - gridcell "+0.0%" [ref=e707]
            - gridcell "+0.00" [ref=e708]
            - gridcell "616,100" [ref=e709]
            - gridcell "0.03" [ref=e710]
            - gridcell "253,200" [ref=e711]
            - gridcell "0.03" [ref=e712]
            - gridcell "343,300" [ref=e713]
            - gridcell "0.03" [ref=e714]
            - gridcell "303,500" [ref=e715]
            - gridcell "0.03" [ref=e716]
            - gridcell "0.03" [ref=e717]
            - gridcell "0.02" [ref=e718]
            - gridcell [ref=e719]
            - gridcell [ref=e720]
            - gridcell [ref=e721]
            - gridcell [ref=e722]
            - gridcell "616,100" [ref=e723]
            - gridcell "♡" [ref=e724] [cursor=pointer]
          - row "0.06 1,200 0.07 200 0.07 400 0.07 100 +0.0% +0.00 4,400 0.07 1,000 0.07 1,000 0.07 1,200 0.07 0.07 0.06 4,400 ♡" [ref=e725]:
            - gridcell "0.06" [ref=e726]
            - gridcell "1,200" [ref=e727]
            - gridcell "0.07" [ref=e728]
            - gridcell "200" [ref=e729]
            - gridcell "0.07" [ref=e730]
            - gridcell "400" [ref=e731]
            - gridcell "0.07" [ref=e732]
            - gridcell "100" [ref=e733]
            - gridcell "+0.0%" [ref=e734]
            - gridcell "+0.00" [ref=e735]
            - gridcell "4,400" [ref=e736]
            - gridcell "0.07" [ref=e737]
            - gridcell "1,000" [ref=e738]
            - gridcell "0.07" [ref=e739]
            - gridcell "1,000" [ref=e740]
            - gridcell "0.07" [ref=e741]
            - gridcell "1,200" [ref=e742]
            - gridcell "0.07" [ref=e743]
            - gridcell "0.07" [ref=e744]
            - gridcell "0.06" [ref=e745]
            - gridcell [ref=e746]
            - gridcell [ref=e747]
            - gridcell [ref=e748]
            - gridcell [ref=e749]
            - gridcell "4,400" [ref=e750]
            - gridcell "♡" [ref=e751] [cursor=pointer]
          - row "0.16 18,100 0.16 21,600 0.16 23,100 0.16 17,500 +0.0% +0.00 155,300 0.16 11,300 0.16 7,000 0.16 15,800 0.16 0.16 0.16 155,300 ♡" [ref=e752]:
            - gridcell "0.16" [ref=e753]
            - gridcell "18,100" [ref=e754]
            - gridcell "0.16" [ref=e755]
            - gridcell "21,600" [ref=e756]
            - gridcell "0.16" [ref=e757]
            - gridcell "23,100" [ref=e758]
            - gridcell "0.16" [ref=e759]
            - gridcell "17,500" [ref=e760]
            - gridcell "+0.0%" [ref=e761]
            - gridcell "+0.00" [ref=e762]
            - gridcell "155,300" [ref=e763]
            - gridcell "0.16" [ref=e764]
            - gridcell "11,300" [ref=e765]
            - gridcell "0.16" [ref=e766]
            - gridcell "7,000" [ref=e767]
            - gridcell "0.16" [ref=e768]
            - gridcell "15,800" [ref=e769]
            - gridcell "0.16" [ref=e770]
            - gridcell "0.16" [ref=e771]
            - gridcell "0.16" [ref=e772]
            - gridcell [ref=e773]
            - gridcell [ref=e774]
            - gridcell [ref=e775]
            - gridcell [ref=e776]
            - gridcell "155,300" [ref=e777]
            - gridcell "♡" [ref=e778] [cursor=pointer]
          - row "0.09 116,000 0.09 272,600 0.09 5,900 0.09 100 +0.0% +0.00 6,189,200 0.09 160,600 0.10 259,400 0.10 186,000 0.09 0.09 0.09 31,000 31,000 6,189,200 ♡" [ref=e779]:
            - gridcell "0.09" [ref=e780]
            - gridcell "116,000" [ref=e781]
            - gridcell "0.09" [ref=e782]
            - gridcell "272,600" [ref=e783]
            - gridcell "0.09" [ref=e784]
            - gridcell "5,900" [ref=e785]
            - gridcell "0.09" [ref=e786]
            - gridcell "100" [ref=e787]
            - gridcell "+0.0%" [ref=e788]
            - gridcell "+0.00" [ref=e789]
            - gridcell "6,189,200" [ref=e790]
            - gridcell "0.09" [ref=e791]
            - gridcell "160,600" [ref=e792]
            - gridcell "0.10" [ref=e793]
            - gridcell "259,400" [ref=e794]
            - gridcell "0.10" [ref=e795]
            - gridcell "186,000" [ref=e796]
            - gridcell "0.09" [ref=e797]
            - gridcell "0.09" [ref=e798]
            - gridcell "0.09" [ref=e799]
            - gridcell [ref=e800]
            - gridcell "31,000" [ref=e801]
            - gridcell "31,000" [ref=e802]
            - gridcell [ref=e803]
            - gridcell "6,189,200" [ref=e804]
            - gridcell "♡" [ref=e805] [cursor=pointer]
          - row "0.03 12,000 0.03 800 0.03 100 0.03 200 +0.0% +0.00 5,600 0.03 14,700 0.03 6,900 0.03 16,500 0.03 0.03 0.03 5,600 ♡" [ref=e806]:
            - gridcell "0.03" [ref=e807]
            - gridcell "12,000" [ref=e808]
            - gridcell "0.03" [ref=e809]
            - gridcell "800" [ref=e810]
            - gridcell "0.03" [ref=e811]
            - gridcell "100" [ref=e812]
            - gridcell "0.03" [ref=e813]
            - gridcell "200" [ref=e814]
            - gridcell "+0.0%" [ref=e815]
            - gridcell "+0.00" [ref=e816]
            - gridcell "5,600" [ref=e817]
            - gridcell "0.03" [ref=e818]
            - gridcell "14,700" [ref=e819]
            - gridcell "0.03" [ref=e820]
            - gridcell "6,900" [ref=e821]
            - gridcell "0.03" [ref=e822]
            - gridcell "16,500" [ref=e823]
            - gridcell "0.03" [ref=e824]
            - gridcell "0.03" [ref=e825]
            - gridcell "0.03" [ref=e826]
            - gridcell [ref=e827]
            - gridcell [ref=e828]
            - gridcell [ref=e829]
            - gridcell [ref=e830]
            - gridcell "5,600" [ref=e831]
            - gridcell "♡" [ref=e832] [cursor=pointer]
          - row "0.07 37,500 0.07 41,600 0.07 13,400 0.08 2,000 +14.3% +0.01 775,500 0.08 28,000 0.07 52,500 0.07 73,800 0.08 0.08 0.07 100 100 775,500 ♡" [ref=e833]:
            - gridcell "0.07" [ref=e834]
            - gridcell "37,500" [ref=e835]
            - gridcell "0.07" [ref=e836]
            - gridcell "41,600" [ref=e837]
            - gridcell "0.07" [ref=e838]
            - gridcell "13,400" [ref=e839]
            - gridcell "0.08" [ref=e840]
            - gridcell "2,000" [ref=e841]
            - gridcell "+14.3%" [ref=e842]
            - gridcell "+0.01" [ref=e843]
            - gridcell "775,500" [ref=e844]
            - gridcell "0.08" [ref=e845]
            - gridcell "28,000" [ref=e846]
            - gridcell "0.07" [ref=e847]
            - gridcell "52,500" [ref=e848]
            - gridcell "0.07" [ref=e849]
            - gridcell "73,800" [ref=e850]
            - gridcell "0.08" [ref=e851]
            - gridcell "0.08" [ref=e852]
            - gridcell "0.07" [ref=e853]
            - gridcell [ref=e854]
            - gridcell "100" [ref=e855]
            - gridcell "100" [ref=e856]
            - gridcell [ref=e857]
            - gridcell "775,500" [ref=e858]
            - gridcell "♡" [ref=e859] [cursor=pointer]
          - row "0.18 248,500 0.19 148,300 0.19 8,600 0.20 7,500 +11.1% +0.02 1,092,200 0.21 27,200 0.19 108,500 0.19 427,000 0.20 0.19 0.18 7,300 500 +6,800 1,092,200 ♡" [ref=e860]:
            - gridcell "0.18" [ref=e861]
            - gridcell "248,500" [ref=e862]
            - gridcell "0.19" [ref=e863]
            - gridcell "148,300" [ref=e864]
            - gridcell "0.19" [ref=e865]
            - gridcell "8,600" [ref=e866]
            - gridcell "0.20" [ref=e867]
            - gridcell "7,500" [ref=e868]
            - gridcell "+11.1%" [ref=e869]
            - gridcell "+0.02" [ref=e870]
            - gridcell "1,092,200" [ref=e871]
            - gridcell "0.21" [ref=e872]
            - gridcell "27,200" [ref=e873]
            - gridcell "0.19" [ref=e874]
            - gridcell "108,500" [ref=e875]
            - gridcell "0.19" [ref=e876]
            - gridcell "427,000" [ref=e877]
            - gridcell "0.20" [ref=e878]
            - gridcell "0.19" [ref=e879]
            - gridcell "0.18" [ref=e880]
            - gridcell "7,300" [ref=e881]
            - gridcell "500" [ref=e882]
            - gridcell "+6,800" [ref=e883]
            - gridcell [ref=e884]
            - gridcell "1,092,200" [ref=e885]
            - gridcell "♡" [ref=e886] [cursor=pointer]
          - row "0.10 1,800 0.10 8,500 0.10 1,100 0.10 200 +0.0% +0.00 5,700 0.10 3,300 0.10 3,300 0.11 2,000 0.10 0.10 0.10 5,700 ♡" [ref=e887]:
            - gridcell "0.10" [ref=e888]
            - gridcell "1,800" [ref=e889]
            - gridcell "0.10" [ref=e890]
            - gridcell "8,500" [ref=e891]
            - gridcell "0.10" [ref=e892]
            - gridcell "1,100" [ref=e893]
            - gridcell "0.10" [ref=e894]
            - gridcell "200" [ref=e895]
            - gridcell "+0.0%" [ref=e896]
            - gridcell "+0.00" [ref=e897]
            - gridcell "5,700" [ref=e898]
            - gridcell "0.10" [ref=e899]
            - gridcell "3,300" [ref=e900]
            - gridcell "0.10" [ref=e901]
            - gridcell "3,300" [ref=e902]
            - gridcell "0.11" [ref=e903]
            - gridcell "2,000" [ref=e904]
            - gridcell "0.10" [ref=e905]
            - gridcell "0.10" [ref=e906]
            - gridcell "0.10" [ref=e907]
            - gridcell [ref=e908]
            - gridcell [ref=e909]
            - gridcell [ref=e910]
            - gridcell [ref=e911]
            - gridcell "5,700" [ref=e912]
            - gridcell "♡" [ref=e913] [cursor=pointer]
          - row "0.19 11,200 0.19 2,200 0.19 300 0.19 4,700 +0.0% +0.00 10,900 0.19 13,800 0.20 5,900 0.20 5,000 0.19 0.19 0.19 800 800 10,900 ♡" [ref=e914]:
            - gridcell "0.19" [ref=e915]
            - gridcell "11,200" [ref=e916]
            - gridcell "0.19" [ref=e917]
            - gridcell "2,200" [ref=e918]
            - gridcell "0.19" [ref=e919]
            - gridcell "300" [ref=e920]
            - gridcell "0.19" [ref=e921]
            - gridcell "4,700" [ref=e922]
            - gridcell "+0.0%" [ref=e923]
            - gridcell "+0.00" [ref=e924]
            - gridcell "10,900" [ref=e925]
            - gridcell "0.19" [ref=e926]
            - gridcell "13,800" [ref=e927]
            - gridcell "0.20" [ref=e928]
            - gridcell "5,900" [ref=e929]
            - gridcell "0.20" [ref=e930]
            - gridcell "5,000" [ref=e931]
            - gridcell "0.19" [ref=e932]
            - gridcell "0.19" [ref=e933]
            - gridcell "0.19" [ref=e934]
            - gridcell [ref=e935]
            - gridcell "800" [ref=e936]
            - gridcell "800" [ref=e937]
            - gridcell [ref=e938]
            - gridcell "10,900" [ref=e939]
            - gridcell "♡" [ref=e940] [cursor=pointer]
          - row "0.11 600 0.11 1,000 0.11 37,200 0.11 1,000 -8.3% -0.01 1,000 0.12 12,400 0.12 100 0.12 100 0.11 0.07 0.00 1,000 ♡" [ref=e941]:
            - gridcell "0.11" [ref=e942]
            - gridcell "600" [ref=e943]
            - gridcell "0.11" [ref=e944]
            - gridcell "1,000" [ref=e945]
            - gridcell "0.11" [ref=e946]
            - gridcell "37,200" [ref=e947]
            - gridcell "0.11" [ref=e948]
            - gridcell "1,000" [ref=e949]
            - gridcell "-8.3%" [ref=e950]
            - gridcell "-0.01" [ref=e951]
            - gridcell "1,000" [ref=e952]
            - gridcell "0.12" [ref=e953]
            - gridcell "12,400" [ref=e954]
            - gridcell "0.12" [ref=e955]
            - gridcell "100" [ref=e956]
            - gridcell "0.12" [ref=e957]
            - gridcell "100" [ref=e958]
            - gridcell "0.11" [ref=e959]
            - gridcell "0.07" [ref=e960]
            - gridcell "0.00" [ref=e961]
            - gridcell [ref=e962]
            - gridcell [ref=e963]
            - gridcell [ref=e964]
            - gridcell [ref=e965]
            - gridcell "1,000" [ref=e966]
            - gridcell "♡" [ref=e967] [cursor=pointer]
          - row "0.03 11,000 0.03 3,400 0.03 1,000 0.03 3,300 +0.0% +0.00 215,400 0.03 5,000 0.03 15,000 0.03 5,300 0.03 0.03 0.03 215,400 ♡" [ref=e968]:
            - gridcell "0.03" [ref=e969]
            - gridcell "11,000" [ref=e970]
            - gridcell "0.03" [ref=e971]
            - gridcell "3,400" [ref=e972]
            - gridcell "0.03" [ref=e973]
            - gridcell "1,000" [ref=e974]
            - gridcell "0.03" [ref=e975]
            - gridcell "3,300" [ref=e976]
            - gridcell "+0.0%" [ref=e977]
            - gridcell "+0.00" [ref=e978]
            - gridcell "215,400" [ref=e979]
            - gridcell "0.03" [ref=e980]
            - gridcell "5,000" [ref=e981]
            - gridcell "0.03" [ref=e982]
            - gridcell "15,000" [ref=e983]
            - gridcell "0.03" [ref=e984]
            - gridcell "5,300" [ref=e985]
            - gridcell "0.03" [ref=e986]
            - gridcell "0.03" [ref=e987]
            - gridcell "0.03" [ref=e988]
            - gridcell [ref=e989]
            - gridcell [ref=e990]
            - gridcell [ref=e991]
            - gridcell [ref=e992]
            - gridcell "215,400" [ref=e993]
            - gridcell "♡" [ref=e994] [cursor=pointer]
          - row "0.53 1,100 0.54 200 0.54 100 0.54 200 +0.0% +0.00 1,300 0.54 400 0.55 400 0.55 200 0.54 0.54 0.54 1,100 +1,100 1,300 ♡" [ref=e995]:
            - gridcell "0.53" [ref=e996]
            - gridcell "1,100" [ref=e997]
            - gridcell "0.54" [ref=e998]
            - gridcell "200" [ref=e999]
            - gridcell "0.54" [ref=e1000]
            - gridcell "100" [ref=e1001]
            - gridcell "0.54" [ref=e1002]
            - gridcell "200" [ref=e1003]
            - gridcell "+0.0%" [ref=e1004]
            - gridcell "+0.00" [ref=e1005]
            - gridcell "1,300" [ref=e1006]
            - gridcell "0.54" [ref=e1007]
            - gridcell "400" [ref=e1008]
            - gridcell "0.55" [ref=e1009]
            - gridcell "400" [ref=e1010]
            - gridcell "0.55" [ref=e1011]
            - gridcell "200" [ref=e1012]
            - gridcell "0.54" [ref=e1013]
            - gridcell "0.54" [ref=e1014]
            - gridcell "0.54" [ref=e1015]
            - gridcell "1,100" [ref=e1016]
            - gridcell [ref=e1017]
            - gridcell "+1,100" [ref=e1018]
            - gridcell [ref=e1019]
            - gridcell "1,300" [ref=e1020]
            - gridcell "♡" [ref=e1021] [cursor=pointer]
          - row "0.13 31,300 0.13 28,300 0.13 68,500 0.14 100 +7.7% +0.01 1,122,800 0.14 9,800 0.14 17,300 0.14 40,000 0.14 0.14 0.13 200 200 1,122,800 ♡" [ref=e1022]:
            - gridcell "0.13" [ref=e1023]
            - gridcell "31,300" [ref=e1024]
            - gridcell "0.13" [ref=e1025]
            - gridcell "28,300" [ref=e1026]
            - gridcell "0.13" [ref=e1027]
            - gridcell "68,500" [ref=e1028]
            - gridcell "0.14" [ref=e1029]
            - gridcell "100" [ref=e1030]
            - gridcell "+7.7%" [ref=e1031]
            - gridcell "+0.01" [ref=e1032]
            - gridcell "1,122,800" [ref=e1033]
            - gridcell "0.14" [ref=e1034]
            - gridcell "9,800" [ref=e1035]
            - gridcell "0.14" [ref=e1036]
            - gridcell "17,300" [ref=e1037]
            - gridcell "0.14" [ref=e1038]
            - gridcell "40,000" [ref=e1039]
            - gridcell "0.14" [ref=e1040]
            - gridcell "0.14" [ref=e1041]
            - gridcell "0.13" [ref=e1042]
            - gridcell [ref=e1043]
            - gridcell "200" [ref=e1044]
            - gridcell "200" [ref=e1045]
            - gridcell [ref=e1046]
            - gridcell "1,122,800" [ref=e1047]
            - gridcell "♡" [ref=e1048] [cursor=pointer]
          - row "0.23 175,200 0.23 141,000 0.23 14,200 0.24 9,100 +4.3% +0.01 10,691,800 0.24 17,600 0.23 213,600 0.23 182,100 0.24 0.23 0.22 124,400 2,080,822 1,956,422 10,691,800 ♡" [ref=e1049]:
            - gridcell "0.23" [ref=e1050]
            - gridcell "175,200" [ref=e1051]
            - gridcell "0.23" [ref=e1052]
            - gridcell "141,000" [ref=e1053]
            - gridcell "0.23" [ref=e1054]
            - gridcell "14,200" [ref=e1055]
            - gridcell "0.24" [ref=e1056]
            - gridcell "9,100" [ref=e1057]
            - gridcell "+4.3%" [ref=e1058]
            - gridcell "+0.01" [ref=e1059]
            - gridcell "10,691,800" [ref=e1060]
            - gridcell "0.24" [ref=e1061]
            - gridcell "17,600" [ref=e1062]
            - gridcell "0.23" [ref=e1063]
            - gridcell "213,600" [ref=e1064]
            - gridcell "0.23" [ref=e1065]
            - gridcell "182,100" [ref=e1066]
            - gridcell "0.24" [ref=e1067]
            - gridcell "0.23" [ref=e1068]
            - gridcell "0.22" [ref=e1069]
            - gridcell "124,400" [ref=e1070]
            - gridcell "2,080,822" [ref=e1071]
            - gridcell "1,956,422" [ref=e1072]
            - gridcell [ref=e1073]
            - gridcell "10,691,800" [ref=e1074]
            - gridcell "♡" [ref=e1075] [cursor=pointer]
          - row "0.11 100 0.11 100 0.11 1,000 0.11 4,600 +0.0% +0.00 50,600 0.11 2,000 0.11 100 0.11 7,000 0.11 0.11 0.11 50,600 ♡" [ref=e1076]:
            - gridcell "0.11" [ref=e1077]
            - gridcell "100" [ref=e1078]
            - gridcell "0.11" [ref=e1079]
            - gridcell "100" [ref=e1080]
            - gridcell "0.11" [ref=e1081]
            - gridcell "1,000" [ref=e1082]
            - gridcell "0.11" [ref=e1083]
            - gridcell "4,600" [ref=e1084]
            - gridcell "+0.0%" [ref=e1085]
            - gridcell "+0.00" [ref=e1086]
            - gridcell "50,600" [ref=e1087]
            - gridcell "0.11" [ref=e1088]
            - gridcell "2,000" [ref=e1089]
            - gridcell "0.11" [ref=e1090]
            - gridcell "100" [ref=e1091]
            - gridcell "0.11" [ref=e1092]
            - gridcell "7,000" [ref=e1093]
            - gridcell "0.11" [ref=e1094]
            - gridcell "0.11" [ref=e1095]
            - gridcell "0.11" [ref=e1096]
            - gridcell [ref=e1097]
            - gridcell [ref=e1098]
            - gridcell [ref=e1099]
            - gridcell [ref=e1100]
            - gridcell "50,600" [ref=e1101]
            - gridcell "♡" [ref=e1102] [cursor=pointer]
          - row "0.35 100 0.36 300 0.36 200 0.36 100 +0.0% +0.00 800 0.36 200 0.37 300 0.37 600 0.37 0.36 0.36 800 ♡" [ref=e1103]:
            - gridcell "0.35" [ref=e1104]
            - gridcell "100" [ref=e1105]
            - gridcell "0.36" [ref=e1106]
            - gridcell "300" [ref=e1107]
            - gridcell "0.36" [ref=e1108]
            - gridcell "200" [ref=e1109]
            - gridcell "0.36" [ref=e1110]
            - gridcell "100" [ref=e1111]
            - gridcell "+0.0%" [ref=e1112]
            - gridcell "+0.00" [ref=e1113]
            - gridcell "800" [ref=e1114]
            - gridcell "0.36" [ref=e1115]
            - gridcell "200" [ref=e1116]
            - gridcell "0.37" [ref=e1117]
            - gridcell "300" [ref=e1118]
            - gridcell "0.37" [ref=e1119]
            - gridcell "600" [ref=e1120]
            - gridcell "0.37" [ref=e1121]
            - gridcell "0.36" [ref=e1122]
            - gridcell "0.36" [ref=e1123]
            - gridcell [ref=e1124]
            - gridcell [ref=e1125]
            - gridcell [ref=e1126]
            - gridcell [ref=e1127]
            - gridcell "800" [ref=e1128]
            - gridcell "♡" [ref=e1129] [cursor=pointer]
        - rowgroup
        - rowgroup
        - rowgroup [ref=e1130]
        - rowgroup
      - text:    
  - generic [ref=e1132]:
    - generic [ref=e1133]: "Cơ sở: Giá ×1,000 │ KL ×1"
    - generic [ref=e1134]: │
    - generic [ref=e1135]: "Phái sinh: Giá ×1 │ KL ×1"
```

# Test source

```ts
  93  |               visibleLabel,
  94  |               visibleHeight,
  95  |               cell: { top: cellRect.top, bottom: cellRect.bottom, width: cellRect.width },
  96  |               labelRect: { top: labelRect.top, bottom: labelRect.bottom, height: labelRect.height },
  97  |               textRect: { top: textRect.top, bottom: textRect.bottom, width: textRect.width },
  98  |             }]
  99  |       })
  100 |     })
  101 | 
  102 |     expect(headerIssues).toEqual([])
  103 |   })
  104 | 
  105 |   test('AG Grid pinned columns', async ({ page }) => {
  106 |     const pinnedLeft = page.locator('.ag-pinned-left-cols-container')
  107 |     await expect(pinnedLeft).toBeVisible()
  108 |   })
  109 | 
  110 |   test('AG Grid row count matches data', async ({ page }) => {
  111 |     const rows = page.locator('.ag-row')
  112 |     const count = await rows.count()
  113 |     expect(count).toBeGreaterThan(0)
  114 |   })
  115 | 
  116 |   test('AG Grid numeric cells do not clip visible values', async ({ page }) => {
  117 |     const clippedCells = await page.evaluate(() => {
  118 |       const numericColumnIds = [
  119 |         'ceil', 'tc', 'floor',
  120 |         'b3p', 'b2p', 'b1p',
  121 |         'lp', 'tvol',
  122 |         'a1p', 'a2p', 'a3p',
  123 |         'hi', 'avg', 'lo',
  124 |         'kltt',
  125 |       ]
  126 |       const selector = numericColumnIds.map((id) => `.ag-cell[col-id="${id}"]`).join(',')
  127 |       const cells = Array.from(document.querySelectorAll<HTMLElement>(selector))
  128 |         .filter((cell) => {
  129 |           const rect = cell.getBoundingClientRect()
  130 |           return rect.width > 0 && rect.height > 0 && cell.textContent?.trim()
  131 |         })
  132 | 
  133 |       return cells.flatMap((cell) => {
  134 |         const range = document.createRange()
  135 |         range.selectNodeContents(cell)
  136 |         const textRect = range.getBoundingClientRect()
  137 |         range.detach()
  138 | 
  139 |         const style = window.getComputedStyle(cell)
  140 |         const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
  141 |         const contentWidth = cell.getBoundingClientRect().width - horizontalPadding
  142 |         const clipped = textRect.width > contentWidth + 0.5
  143 | 
  144 |         return clipped
  145 |           ? [{
  146 |               column: cell.getAttribute('col-id'),
  147 |               text: cell.textContent?.trim(),
  148 |               contentWidth,
  149 |               textWidth: textRect.width,
  150 |             }]
  151 |           : []
  152 |       })
  153 |     })
  154 | 
  155 |     expect(clippedCells).toEqual([])
  156 |   })
  157 | 
  158 |   test('AG Grid priceboard scrolls horizontally on small screens', async ({ page }) => {
  159 |     await page.setViewportSize({ width: 768, height: 720 })
  160 |     await page.goto('/')
  161 |     await page.waitForLoadState('networkidle')
  162 |     await page.waitForTimeout(1500)
  163 | 
  164 |     const scrollState = await page.evaluate(async () => {
  165 |       const shell = document.querySelector<HTMLElement>('.priceboard-scroll-shell')
  166 |       if (!shell) {
  167 |         return { hasShell: false }
  168 |       }
  169 | 
  170 |       const before = shell.scrollLeft
  171 |       shell.scrollLeft = shell.scrollWidth
  172 |       await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  173 |       const after = shell.scrollLeft
  174 |       const shellRect = shell.getBoundingClientRect()
  175 |       const watchlist = document.querySelector<HTMLElement>('.ag-cell[col-id="watchlist"]')
  176 |       const watchlistRect = watchlist?.getBoundingClientRect()
  177 | 
  178 |       return {
  179 |         hasShell: true,
  180 |         hasOverflow: shell.scrollWidth > shell.clientWidth + 1,
  181 |         moved: after > before,
  182 |         clientWidth: shell.clientWidth,
  183 |         scrollWidth: shell.scrollWidth,
  184 |         scrollbarInViewport: shellRect.bottom <= window.innerHeight,
  185 |         watchlistVisibleAfterScroll: Boolean(
  186 |           watchlistRect
  187 |             && watchlistRect.left >= 0
  188 |             && watchlistRect.right <= window.innerWidth,
  189 |         ),
  190 |       }
  191 |     })
  192 | 
> 193 |     expect(scrollState).toMatchObject({
      |                         ^ Error: expect(received).toMatchObject(expected)
  194 |       hasShell: true,
  195 |       hasOverflow: true,
  196 |       moved: true,
  197 |       scrollbarInViewport: true,
  198 |       watchlistVisibleAfterScroll: true,
  199 |     })
  200 |   })
  201 | })
  202 | 
```