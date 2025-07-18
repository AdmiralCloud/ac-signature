
## [4.0.7](https://github.com/mmpro/ac-signature/compare/v4.0.6..v4.0.7) (2025-07-18 18:33:12)


### Bug Fix

* **App:** Fixed legacy support for signature version 1 and 2 | MP | [86aa6f2a7f93e09574d50a34da5683ab1b6f784a](https://github.com/mmpro/ac-signature/commit/86aa6f2a7f93e09574d50a34da5683ab1b6f784a)    
Fixed legacy support for signature version 1 and 2  
Related issues:

## [4.0.6](https://github.com/mmpro/ac-signature/compare/v4.0.5..v4.0.6) (2025-07-18 12:52:05)


### Bug Fix

* **App:** Improved code quality | MP | [1d3edddfa3d8228b1ded0e3236ca7c07608f1c77](https://github.com/mmpro/ac-signature/commit/1d3edddfa3d8228b1ded0e3236ca7c07608f1c77)    
Improved code quality  
Related issues:
* **App:** Reduced code complexity | MP | [adc2c6390cbdb228fe8babbe6dfefad08b3aece4](https://github.com/mmpro/ac-signature/commit/adc2c6390cbdb228fe8babbe6dfefad08b3aece4)    
Reduced code complexity  
Related issues:
* **App:** Further security fixes | MP | [4a78fa258e041b4c2c28d25787631e8544176084](https://github.com/mmpro/ac-signature/commit/4a78fa258e041b4c2c28d25787631e8544176084)    
Fixed Generic Object Injection Sink  
Related issues:

## [4.0.5](https://github.com/mmpro/ac-signature/compare/v4.0.4..v4.0.5) (2025-07-18 11:30:54)


### Bug Fix

* **App:** Fixed security issues | MP | [bac19d3005c561d34d5e7f9dcd69805d96b2fdd7](https://github.com/mmpro/ac-signature/commit/bac19d3005c561d34d5e7f9dcd69805d96b2fdd7)    
Improved hash comparison to avoid timing attacks, fixed Generic Object Injection Sinks  
Related issues:
* **App:** Package updates | MP | [cd2315d95816b809b61561c407db86342de64562](https://github.com/mmpro/ac-signature/commit/cd2315d95816b809b61561c407db86342de64562)    
Package updates  
Related issues:

## [4.0.4](https://github.com/mmpro/ac-signature/compare/v4.0.3..v4.0.4) (2025-04-20 06:18:29)


### Bug Fix

* **App:** Package updates | MP | [b8fc9d05dbdd7f44e08cb8719bb76b02404538f2](https://github.com/mmpro/ac-signature/commit/b8fc9d05dbdd7f44e08cb8719bb76b02404538f2)    
Package updates  
Related issues:

## [4.0.3](https://github.com/mmpro/ac-signature/compare/v4.0.2..v4.0.3) (2025-04-19 18:42:40)


### Bug Fix

* **App:** Package updates | MP | [af08005c73e630747d87161b9047e09b0fb6c68c](https://github.com/mmpro/ac-signature/commit/af08005c73e630747d87161b9047e09b0fb6c68c)    
Package updates  
Related issues:

## [4.0.2](https://github.com/mmpro/ac-signature/compare/v4.0.1..v4.0.2) (2025-04-02 11:11:45)


### Bug Fix

* **App:** Package updates | MP | [82f872236e9ad391f0c3b3445f3e4dc55e302fc6](https://github.com/mmpro/ac-signature/commit/82f872236e9ad391f0c3b3445f3e4dc55e302fc6)    
Package updates  
Related issues:
<a name="4.0.1"></a>

## [4.0.1](https://github.com/mmpro/ac-signature/compare/v4.0.0..v4.0.1) (2024-09-02 18:24:34)


### Bug Fix

* **App:** Make sure path is just a path | MP | [a269a1747f9511ae6a35c9debbafc2558b20840b](https://github.com/mmpro/ac-signature/commit/a269a1747f9511ae6a35c9debbafc2558b20840b)    
Do not consider query params added to path for signature.  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Updated packages | MP | [3085beaaf3c6eac444c69ee4797f17615d743687](https://github.com/mmpro/ac-signature/commit/3085beaaf3c6eac444c69ee4797f17615d743687)    
Updated packages  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="4.0.0"></a>
 
# [4.0.0](https://github.com/mmpro/ac-signature/compare/v3.1.0..v4.0.0) (2024-07-13 14:31:41)


### Bug Fix

* **App:** Set min node version to 18 | MP | [2020d540418a19943d8976d7c381de3bf94b2272](https://github.com/mmpro/ac-signature/commit/2020d540418a19943d8976d7c381de3bf94b2272)    
Set min node version to 18  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Documentation

* **App:** Updated README | MP | [9616fd15c8978e28490fadcc6cf07b577cdb959e](https://github.com/mmpro/ac-signature/commit/9616fd15c8978e28490fadcc6cf07b577cdb959e)    
Updated README  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Added coverage test | MP | [6d84e8340e9c202f96cc84b0ec3ddbf4c9838345](https://github.com/mmpro/ac-signature/commit/6d84e8340e9c202f96cc84b0ec3ddbf4c9838345)    
Added coverage tests  
Related issues: [undefined/undefined#master](undefined/browse/master)
## BREAKING CHANGES
* **App:** Set min node version to 18
<a name="3.1.0"></a>
 
# [3.1.0](https://github.com/mmpro/ac-signature/compare/v3.0.0..v3.1.0) (2024-07-13 07:36:14)


### Feature

* **App:** Add option to use identifier as part of hash | MP | [bd20f511ac73e19c5d66c6471c948278eead009a](https://github.com/mmpro/ac-signature/commit/bd20f511ac73e19c5d66c6471c948278eead009a)    
Some requests are made on behalf of users. To secure them, this information is added as part of the signed hash. Use signature version 5  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Updated packages | MP | [a40f24dd8125d7d3d6c44e693f0b037dae42f82e](https://github.com/mmpro/ac-signature/commit/a40f24dd8125d7d3d6c44e693f0b037dae42f82e)    
Updated packages  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="3.0.0"></a>
 
# [3.0.0](https://github.com/mmpro/ac-signature/compare/v2.1.2..v3.0.0) (2023-02-10 09:21:24)


### Bug Fix

* **App:** Requires Node 16 | MP | [9c0dfcf2169f4d5326905378674a3a9aaa93e1ff](https://github.com/mmpro/ac-signature/commit/9c0dfcf2169f4d5326905378674a3a9aaa93e1ff)    
Requires Node 16  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Updated automatic Github test | MP | [24b5ceb655b91f3771589ef19484f30dad06a351](https://github.com/mmpro/ac-signature/commit/24b5ceb655b91f3771589ef19484f30dad06a351)    
Check Node 16 and 18  
Related issues: [undefined/undefined#master](undefined/browse/master)
## BREAKING CHANGES
* **App:** Requires Node 16 or higher
<a name="2.1.2"></a>

## [2.1.2](https://github.com/mmpro/ac-signature/compare/v2.1.1..v2.1.2) (2023-02-10 09:16:37)


### Bug Fix

* **App:** Package updates | MP | [1588aa640aa888eaac359e77344ae220b8207ce1](https://github.com/mmpro/ac-signature/commit/1588aa640aa888eaac359e77344ae220b8207ce1)    
Package updates incl change of test framework  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Documentation

* **App:** Use IAM for examples with user endpoint | MP | [f084777671a624ad1ca092fc9988e4ab59d651d0](https://github.com/mmpro/ac-signature/commit/f084777671a624ad1ca092fc9988e4ab59d651d0)    
Use IAM for examples with user endpoint  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="2.1.1"></a>

## [2.1.1](https://github.com/mmpro/ac-signature/compare/v2.1.0..v2.1.1) (2022-09-16 11:24:38)


### Bug Fix

* **App:** Fixed an issue from version 2.1.0 | MP | [c69f278a153089480b76eb4946ba33d1385de8d7](https://github.com/mmpro/ac-signature/commit/c69f278a153089480b76eb4946ba33d1385de8d7)    
2.1.0 sorted different that 2.0.9 and was therefore not backwards compatible. The new version fixes this by introducting version 3 signature.  
Related issues: [undefined/undefined#master](undefined/browse/master)
### Chores

* **App:** Updated packages | MP | [4d17cf4835a0a0179ed7ffed784ed2932dbd6d1c](https://github.com/mmpro/ac-signature/commit/4d17cf4835a0a0179ed7ffed784ed2932dbd6d1c)    
Updated packages  
Related issues: [undefined/undefined#master](undefined/browse/master)
<a name="2.1.0"></a>
 
# [2.1.0](https://github.com/mmpro/ac-signature/compare/v2.0.9..v2.1.0) (2022-09-07 11:28:09)


### Feature

* **App:** Version 2 works with path alone | MP | [4c33d521955451db35f78df3318940a9b73cda2c](https://github.com/mmpro/ac-signature/commit/4c33d521955451db35f78df3318940a9b73cda2c)    
Instead of controller/action, the new version 2 only requires the path.  
Related issues: [undefined/undefined#signature-format2](undefined/browse/signature-format2)
### Chores

* **App:** Added option for test release and removed vscode settings from git | MP | [913b4e5d26b2554e9fb5db94687b47f813f33032](https://github.com/mmpro/ac-signature/commit/913b4e5d26b2554e9fb5db94687b47f813f33032)    
Added option for test release and removed vscode settings from git  
Related issues: [undefined/undefined#master](undefined/browse/master)
* **App:** Version only wotks with Node 12 or above | MP | [b0de0c6a39c83fae675e3b2e2659e46abef4cdc5](https://github.com/mmpro/ac-signature/commit/b0de0c6a39c83fae675e3b2e2659e46abef4cdc5)    
Version only wotks with Node 12 or above  
Related issues: [undefined/undefined#signature-format2](undefined/browse/signature-format2)
* **App:** Updated lint fix for multiple tests | MP | [7a8feb04f88f2a18287017b48bb8f5906036eaa8](https://github.com/mmpro/ac-signature/commit/7a8feb04f88f2a18287017b48bb8f5906036eaa8)    
Updated lint fix for multiple tests  
Related issues: [undefined/undefined#signature-format2](undefined/browse/signature-format2)
### Chores

* **App:** Updated packages | MP | [5ef884901b7ebf67073ad196c38206341ff1538c](https://github.com/mmpro/ac-signature/commit/5ef884901b7ebf67073ad196c38206341ff1538c)    
Updated packages  
Related issues: [undefined/undefined#master](undefined/browse/master)
* **App:** Updated packages | MP | [52fff6c61d40da140e9cf76bb5664abb23481363](https://github.com/mmpro/ac-signature/commit/52fff6c61d40da140e9cf76bb5664abb23481363)    
Updated packages  
Related issues: [undefined/undefined#signature-format2](undefined/browse/signature-format2)
<a name="2.0.9"></a>

## [2.0.9](https://github.com/mmpro/ac-signature/compare/v2.0.8..v2.0.9) (2021-04-15 18:09:40)


### Bug Fix

* **App:** Improved error message for rts deviation | MP | [d565f8b257d44df61e4b1593ffde1d0b97067c7a](https://github.com/mmpro/ac-signature/commit/d565f8b257d44df61e4b1593ffde1d0b97067c7a)    
Improved error message for rts deviation
### Chores

* **App:** Updated .gitignore | MP | [db0ebc6b319d547c66132e891da4688268081b73](https://github.com/mmpro/ac-signature/commit/db0ebc6b319d547c66132e891da4688268081b73)    
Updated .gitignore
* **App:** Updated gitignore | MP | [98158b6c75d9741a365da7e8a8bc6c959f6378d6](https://github.com/mmpro/ac-signature/commit/98158b6c75d9741a365da7e8a8bc6c959f6378d6)    
Updated gitignore
### Chores

* **App:** Updated packages | MP | [c23a2be835ddf43bc597fabcc2f48557a0b58328](https://github.com/mmpro/ac-signature/commit/c23a2be835ddf43bc597fabcc2f48557a0b58328)    
Updated packages
<a name="2.0.8"></a>

## [2.0.8](https://github.com/mmpro/ac-signature/compare/v2.0.7..v2.0.8) (2020-12-20 14:16:59)


### Bug Fix

* **App:** Updated packages | MP | [e51d5286387b9b1478ec94b7e0bf63c272bf24a1](https://github.com/mmpro/ac-signature/commit/e51d5286387b9b1478ec94b7e0bf63c272bf24a1)    
Updated packages
### Documentation

* **App:** Added license report | MP | [99bcb599045c29ba6b2863b975aec4d86121e5f4](https://github.com/mmpro/ac-signature/commit/99bcb599045c29ba6b2863b975aec4d86121e5f4)    
Added license report
<a name="2.0.7"></a>

## [2.0.7](https://github.com/mmpro/ac-signature/compare/v2.0.6..v2.0.7) (2020-11-23 11:48:54)


### Bug Fix

* **App:** Added some debugging options | MP | [6546fff22703f0c92e56d471eccd56d7f13ce66e](https://github.com/mmpro/ac-signature/commit/6546fff22703f0c92e56d471eccd56d7f13ce66e)    

* **App:** Added some debugging options | MP | [786979514ec3f6ef7c51d6fcb3beb72b109cf651](https://github.com/mmpro/ac-signature/commit/786979514ec3f6ef7c51d6fcb3beb72b109cf651)    
Added some debugging options
<a name="2.0.6"></a>

## [2.0.6](https://github.com/mmpro/ac-signature/compare/v2.0.5..v2.0.6) (2020-11-22 14:56:49)


### Bug Fix

* **App:** Check for timestamp deviation | MP | [c861ec91241d3c3bd667b3dc8aeefa1a7fa33caa](https://github.com/mmpro/ac-signature/commit/c861ec91241d3c3bd667b3dc8aeefa1a7fa33caa)    
Reject payloads that were signed with an outdated timestamp (+/- 10 seconds)
<a name="2.0.5"></a>

## [2.0.5](https://github.com/mmpro/ac-signature/compare/v2.0.4..v2.0.5) (2020-11-21 19:01:25)


### Bug Fix

* **App:** Always log hash mismatch | MP | [20b842f309faa43cbd928556f96ccb93b8759661](https://github.com/mmpro/ac-signature/commit/20b842f309faa43cbd928556f96ccb93b8759661)    
Always log hash mismatch
### Chores

* **App:** Updated packages | MP | [40c61cf9120b872e13551fe2470431bdf9c048f8](https://github.com/mmpro/ac-signature/commit/40c61cf9120b872e13551fe2470431bdf9c048f8)    
Updated packages
<a name="2.0.4"></a>

## [2.0.4](https://github.com/mmpro/ac-signature/compare/v2.0.3..v2.0.4) (2020-08-20 06:35:36)


### Bug Fix

* **App:** Force patch after package update | MP | [6622bdb21298154a10d2d57f7d0dfe148bf6ca27](https://github.com/mmpro/ac-signature/commit/6622bdb21298154a10d2d57f7d0dfe148bf6ca27)    
Force patch after package update
<a name="2.0.3"></a>

## [2.0.3](https://github.com/mmpro/ac-signature/compare/v2.0.2..v2.0.3) (2020-07-30 16:10:41)


### Bug Fix

* **App:** Updated packages | MP | [eabb386614e9bd4a0158b8d654c42a418e5cd5f1](https://github.com/mmpro/ac-signature/commit/eabb386614e9bd4a0158b8d654c42a418e5cd5f1)    
Updated packages - force a patch release.
### Tests

* **App:** Changed tests | MP | [3795952133761239c20d9da78462120293bcd33f](https://github.com/mmpro/ac-signature/commit/3795952133761239c20d9da78462120293bcd33f)    
Tests are no longer dependent on AC API credentials
### Chores

* **App:** Updated packages | MP | [738a177943ccd8af1d441f48ad72de43318d16b5](https://github.com/mmpro/ac-signature/commit/738a177943ccd8af1d441f48ad72de43318d16b5)    
Updated packages
* **App:** Updated packages | MP | [d22c51582a0ee50cdde9ff20dc8923ca542f8f9b](https://github.com/mmpro/ac-signature/commit/d22c51582a0ee50cdde9ff20dc8923ca542f8f9b)    
Updated packages
* **App:** Updated packages | MP | [fde25ec7f34d6f43e29faef839869f3cb0de95bd](https://github.com/mmpro/ac-signature/commit/fde25ec7f34d6f43e29faef839869f3cb0de95bd)    
Updated packages
<a name="2.0.2"></a>

## [2.0.2](https://github.com/mmpro/ac-signature/compare/v2.0.1..v2.0.2) (2020-03-28 22:11:18)


### Bug Fix

* **App:** Typo fix | MP | [f840e38f4a1fbf14f79769d6b6cb4e5e3ad647c6](https://github.com/mmpro/ac-signature/commit/f840e38f4a1fbf14f79769d6b6cb4e5e3ad647c6)    
Do not use accessKey here - it is not available
### Refactor

* **Misc:** Improved logging | MP | [99b564e5c54e9e9967b131b34053ffd61e8acf93](https://github.com/mmpro/ac-signature/commit/99b564e5c54e9e9967b131b34053ffd61e8acf93)    
Improved logging
### Chores

* **App:** Updated packages | MP | [0468a3050742dac101dbb0f8ea6186f48862c03d](https://github.com/mmpro/ac-signature/commit/0468a3050742dac101dbb0f8ea6186f48862c03d)    
Updated packages
* **App:** Use AC Semantic Release Management | MP | [44a2083f0cb105ba33b3e4f10d7b8a5069247985](https://github.com/mmpro/ac-signature/commit/44a2083f0cb105ba33b3e4f10d7b8a5069247985)    
Use AC Semantic Release Management
* **deps:** bump acorn from 7.1.0 to 7.1.1 | [6dc2f1476bcfdb76a8363f07af87957e94e97b6a](https://github.com/mmpro/ac-signature/commit/6dc2f1476bcfdb76a8363f07af87957e94e97b6a)    
Merge: bb320ed 6b4d54c  
Merge pull request #3 from mmpro/dependabot/npm_and_yarn/acorn-7.1.1
* **deps:** bump acorn from 7.1.0 to 7.1.1 | [6b4d54c58b88b68f04d94f7e00c3c6102f5680f0](https://github.com/mmpro/ac-signature/commit/6b4d54c58b88b68f04d94f7e00c3c6102f5680f0)    
Bumps [acorn](https://github.com/acornjs/acorn) from 7.1.0 to 7.1.1.  
[acornjs/acorn#releases)]([Release notes](https://github.com/acornjs/acorn/releases)) [acornjs/acorn#7.1.0...7.1.1)]([Commits](https://github.com/acornjs/acorn/compare/7.1.0...7.1.1)) Signed-off-by: dependabot[bot] <support@github.com>
<a name="2.0.1"></a>
## [2.0.1](https://github.com/mmpro/ac-signature/compare/v2.0.0...v2.0.1) (2019-12-21 15:40)


### Bug Fixes

* **Misc:** Fixed check for integers in GET params | MP ([8a11719b936d31b0a8f75ebeb6abf8a09a2b28dc](https://github.com/mmpro/ac-signature/commit/8a11719b936d31b0a8f75ebeb6abf8a09a2b28dc))    
  Fixed check for integers in GET params



<a name="2.0.0"></a>
# [2.0.0](https://github.com/mmpro/ac-signature/compare/v1.0.2...v2.0.0) (2019-11-01 17:28)


### Bug Fixes

* **Misc:** Version bump due to conflict with npmjs.org | MP ([25d834bc5ee92e936de4df2b6a60a1cf17eee4cb](https://github.com/mmpro/ac-signature/commit/25d834bc5ee92e936de4df2b6a60a1cf17eee4cb))    
  Version bump due to conflict with npmjs.org


### BREAKING CHANGES

* **Misc:** Now two function are available



<a name="1.0.2"></a>
## [1.0.2](https://github.com/mmpro/ac-signature/compare/v1.0.1...v1.0.2) (2019-11-01 17:25)


### Bug Fixes

* **Misc:** Version bump due to conflict with npmjs.org | MP ([f57223d693d95a6c3d263f6431a1fab4190e4842](https://github.com/mmpro/ac-signature/commit/f57223d693d95a6c3d263f6431a1fab4190e4842))    
  Version bump due to conflict with npmjs.org



<a name="1.0.1"></a>
## [1.0.1](https://github.com/mmpro/ac-signature/compare/v1.0.0...v1.0.1) (2019-11-01 17:23)


### Bug Fixes

* **Misc:** Version bump due to conflict with npmjs.org | MP ([1d4d7fe202b4a4e619213be6409c9bec51f68469](https://github.com/mmpro/ac-signature/commit/1d4d7fe202b4a4e619213be6409c9bec51f68469))    
  Force version bump due to conflictwith npmjs.org



<a name="1.0.0"></a>
# 1.0.0 (2019-11-01 17:19)


### Features

* **Misc:** It is now possible to check signed payloads | MP ([5c97f78](https://github.com/mmpro/ac-signature/commit/5c97f78))    
  It is now possible to check signed payloads


### BREAKING CHANGES

* **Misc:** The function must be called with acsignature.sign(...) instead of acsignature(...)



**0.0.1 - 03.01.2017/13:20**
+ initial version
