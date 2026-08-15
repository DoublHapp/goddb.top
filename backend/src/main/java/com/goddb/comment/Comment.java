package com.goddb.comment;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@TableName("comments")
@Getter
@Setter
@NoArgsConstructor
public class Comment {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String postSlug;

    private Long parentId;

    private String nickname;

    private String email;

    private String content;

    private String status;

    private Instant createdAt;
}
